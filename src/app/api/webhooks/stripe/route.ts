import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { sendOrderConfirmationEmail } from '@/lib/email';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'payment_intent.payment_failed') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    try {
      // Find the order by paymentIntentId and mark as failed
      const order = await prisma.order.findUnique({
        where: { paymentIntentId: paymentIntent.id },
        select: { id: true, orderNumber: true, guestEmail: true, userId: true },
      });

      if (order) {
        await prisma.order.update({
          where: { id: order.id },
          data: { paymentStatus: 'FAILED', status: 'CANCELLED', cancelledAt: new Date() },
        });
        await prisma.orderStatusHistory.create({
          data: {
            orderId: order.id,
            status: 'CANCELLED',
            note: `Payment failed: ${paymentIntent.last_payment_error?.message ?? 'Unknown error'}`,
          },
        });
      }
    } catch (err) {
      console.error('Payment failed handler error:', err);
    }
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const meta = session.metadata!;

    try {
      // Create shipping address
      let shippingAddressId: string | undefined;
      if (meta.userId) {
        const addr = await prisma.address.create({
          data: {
            userId: meta.userId,
            firstName: meta.firstName,
            lastName: meta.lastName,
            addressLine1: meta.addressLine1,
            addressLine2: meta.addressLine2 || null,
            city: meta.city,
            postalCode: meta.postalCode,
            country: meta.country,
            phone: meta.phone,
          },
        });
        shippingAddressId = addr.id;
      }

      // Retrieve line items from Stripe
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100 });

      // Create order
      const order = await prisma.order.create({
        data: {
          orderNumber: meta.orderNumber,
          userId: meta.userId || null,
          guestEmail: !meta.userId ? session.customer_email : null,
          status: 'PAID',
          paymentStatus: 'PAID',
          paymentMethod: 'STRIPE',
          paymentIntentId: session.payment_intent as string,
          shippingAddressId,
          shippingMethod: meta.shippingMethod as any,
          subtotal: session.amount_subtotal! / 100,
          shippingCost: 0,
          taxAmount: 0,
          total: session.amount_total! / 100,
          giftMessage: meta.giftMessage || null,
          paidAt: new Date(),
          items: {
            create: lineItems.data
              .filter(item => !item.description?.startsWith('Shipping'))
              .map(item => ({
                productName: item.description || 'Product',
                sku: 'N/A',
                price: (item.price?.unit_amount || 0) / 100,
                quantity: item.quantity || 1,
                total: (item.amount_total || 0) / 100,
                productId: 'placeholder', // Will be resolved via product lookup
              })),
          },
        },
      });

      // Add status history
      await prisma.orderStatusHistory.create({
        data: { orderId: order.id, status: 'PAID', note: 'Payment confirmed via Stripe' },
      });

      // Send confirmation email
      if (session.customer_email) {
        await sendOrderConfirmationEmail(
          session.customer_email,
          meta.orderNumber,
          lineItems.data.map(item => ({
            name: item.description || 'Product',
            quantity: item.quantity || 1,
            price: (item.price?.unit_amount || 0) / 100,
          })),
          session.amount_total! / 100,
          meta.firstName
        ).catch(console.error);
      }
    } catch (err) {
      console.error('Order creation failed:', err);
    }
  }

  return NextResponse.json({ received: true });
}

