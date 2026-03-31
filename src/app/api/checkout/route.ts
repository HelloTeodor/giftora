import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { stripe, formatAmountForStripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { generateOrderNumber } from '@/lib/utils';

export async function POST(req: NextRequest) {
  const session = await auth();

  try {
    const body = await req.json();
    const {
      email, firstName, lastName, phone,
      addressLine1, addressLine2, city, state, postalCode, country,
      shippingMethod, giftMessage, items,
      couponCode, discountAmount: clientDiscountAmount,
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // Validate products and calculate total
    const productIds = items.map((i: { productId: string }) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, status: 'ACTIVE' },
    });

    let subtotal = 0;
    const lineItems = items.map((item: { productId: string; quantity: number; price: number }) => {
      const product = products.find(p => p.id === item.productId);
      if (!product) throw new Error(`Product ${item.productId} not found`);
      const price = Number(product.salePrice || product.basePrice);
      subtotal += price * item.quantity;
      return {
        price_data: {
          currency: 'eur',
          product_data: { name: product.name },
          unit_amount: formatAmountForStripe(price),
        },
        quantity: item.quantity,
      };
    });

    const shippingCost = shippingMethod === 'STANDARD' && subtotal >= 75 ? 0
      : shippingMethod === 'EXPRESS' ? 9.99
      : shippingMethod === 'OVERNIGHT' ? 14.99
      : 4.99;

    if (shippingCost > 0) {
      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: { name: `Shipping (${shippingMethod})` },
          unit_amount: formatAmountForStripe(shippingCost),
        },
        quantity: 1,
      });
    }

    // Validate coupon server-side and apply discount
    let verifiedDiscountAmount = 0;
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({ where: { code: couponCode.toUpperCase() } });
      if (coupon && coupon.isActive) {
        const now = new Date();
        const validTime = (!coupon.startsAt || coupon.startsAt <= now) && (!coupon.expiresAt || coupon.expiresAt >= now);
        const validUsage = !coupon.usageLimit || coupon.usageCount < coupon.usageLimit;
        const validMin = !coupon.minOrderAmount || subtotal >= Number(coupon.minOrderAmount);
        if (validTime && validUsage && validMin) {
          const val = Number(coupon.value);
          if (coupon.type === 'PERCENTAGE') verifiedDiscountAmount = Math.round(subtotal * val / 100 * 100) / 100;
          else if (coupon.type === 'FIXED') verifiedDiscountAmount = Math.min(val, subtotal);
          else if (coupon.type === 'FREE_SHIPPING') verifiedDiscountAmount = shippingCost;
        }
      }
    }

    // Add discount line item if applicable (create Stripe coupon)
    let stripeCouponId: string | undefined;
    if (verifiedDiscountAmount > 0) {
      const stripeCoupon = await stripe.coupons.create({
        amount_off: Math.round(verifiedDiscountAmount * 100),
        currency: 'eur',
        duration: 'once',
        name: couponCode ? `Discount: ${couponCode}` : 'Discount',
      });
      stripeCouponId = stripeCoupon.id;
    }

    const orderNumber = generateOrderNumber();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    const stripeSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      customer_email: email,
      ...(stripeCouponId
        ? { discounts: [{ coupon: stripeCouponId }] }
        : { allow_promotion_codes: true }),
      metadata: {
        orderNumber,
        userId: session?.user.id || '',
        shippingMethod,
        giftMessage: giftMessage || '',
        couponCode: couponCode || '',
        discountAmount: String(verifiedDiscountAmount),
        addressLine1,
        addressLine2: addressLine2 || '',
        city,
        postalCode,
        country,
        firstName,
        lastName,
        phone,
      },
      success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order=${orderNumber}`,
      cancel_url: `${appUrl}/checkout`,
      billing_address_collection: 'auto',
      shipping_address_collection: { allowed_countries: ['IE', 'GB', 'DE', 'FR', 'ES', 'IT', 'NL', 'US', 'CA'] },
    });

    return NextResponse.json({ sessionId: stripeSession.id });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 });
  }
}
