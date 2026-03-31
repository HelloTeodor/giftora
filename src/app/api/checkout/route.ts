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
      couponCode,
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // Validate products
    const productIds = items.map((i: { productId: string }) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, status: 'ACTIVE' },
    });

    if (products.length !== productIds.length) {
      return NextResponse.json({ error: 'One or more products are unavailable' }, { status: 400 });
    }

    // Build line items and subtotal
    let subtotal = 0;
    const lineItems = items.map((item: { productId: string; quantity: number }) => {
      const product = products.find(p => p.id === item.productId)!;
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

    const shippingCost =
      shippingMethod === 'EXPRESS' ? 9.99
      : shippingMethod === 'OVERNIGHT' ? 14.99
      : 0; // STANDARD is always free

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

    // Server-side coupon validation
    let verifiedDiscountAmount = 0;
    let validatedCouponCode: string | null = null;
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
          else if (coupon.type === 'FIXED') verifiedDiscountAmount = Math.min(val, subtotal + shippingCost);
          else if (coupon.type === 'FREE_SHIPPING') verifiedDiscountAmount = shippingCost;
          validatedCouponCode = coupon.code;
        }
      }
    }

    const total = Math.max(0, subtotal + shippingCost - verifiedDiscountAmount);
    const orderNumber = generateOrderNumber();

    // Create shipping address record
    let shippingAddressId: string | undefined;
    if (session?.user.id) {
      const addr = await prisma.address.create({
        data: {
          userId: session.user.id,
          firstName, lastName, phone,
          addressLine1,
          addressLine2: addressLine2 || null,
          city, state: state || null, postalCode, country,
          isDefault: false,
        },
      });
      shippingAddressId = addr.id;
    }

    // Pre-create order as PENDING — webhook will update to PAID
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: session?.user.id || null,
        guestEmail: !session ? email : null,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        paymentMethod: 'STRIPE',
        shippingMethod: shippingMethod as 'STANDARD' | 'EXPRESS' | 'OVERNIGHT' | 'PICKUP',
        shippingAddressId,
        subtotal,
        shippingCost,
        discountAmount: verifiedDiscountAmount,
        couponCode: validatedCouponCode,
        taxAmount: 0,
        total,
        giftMessage: giftMessage || null,
        items: {
          create: items.map((item: { productId: string; quantity: number }) => {
            const product = products.find(p => p.id === item.productId)!;
            const price = Number(product.salePrice || product.basePrice);
            return {
              productId: item.productId,
              productName: product.name,
              sku: product.sku || 'N/A',
              price,
              quantity: item.quantity,
              total: price * item.quantity,
            };
          }),
        },
      },
    });

    // Create Stripe coupon for discount
    let stripeCouponId: string | undefined;
    if (verifiedDiscountAmount > 0) {
      const sc = await stripe.coupons.create({
        amount_off: Math.round(verifiedDiscountAmount * 100),
        currency: 'eur',
        duration: 'once',
        name: validatedCouponCode ? `Discount: ${validatedCouponCode}` : 'Discount',
      });
      stripeCouponId = sc.id;
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    const stripeSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      customer_email: email,
      ...(stripeCouponId
        ? { discounts: [{ coupon: stripeCouponId }] }
        : { allow_promotion_codes: true }),
      metadata: {
        orderId: order.id,
        orderNumber,
        userId: session?.user.id || '',
      },
      success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order=${orderNumber}`,
      cancel_url: `${appUrl}/checkout`,
      billing_address_collection: 'auto',
    });

    return NextResponse.json({ sessionId: stripeSession.id });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Checkout failed. Please try again.' }, { status: 500 });
  }
}
