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

    const orderNumber = generateOrderNumber();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    const stripeSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      customer_email: email,
      metadata: {
        orderNumber,
        userId: session?.user.id || '',
        shippingMethod,
        giftMessage: giftMessage || '',
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
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      shipping_address_collection: { allowed_countries: ['IE', 'GB', 'DE', 'FR', 'ES', 'IT', 'NL', 'US', 'CA'] },
    });

    return NextResponse.json({ sessionId: stripeSession.id });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 });
  }
}
