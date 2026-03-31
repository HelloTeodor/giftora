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
      await prisma.order.updateMany({
        where: { paymentIntentId: paymentIntent.id },
        data: { paymentStatus: 'FAILED', status: 'CANCELLED', cancelledAt: new Date() },
      });
    } catch (err) {
      console.error('Payment failed handler error:', err);
    }
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const meta = session.metadata!;

    try {
      const orderId = meta.orderId;
      if (!orderId) {
        console.error('No orderId in Stripe metadata');
        return NextResponse.json({ received: true });
      }

      // Update the pre-created order to PAID
      const order = await prisma.order.update({
        where: { id: orderId },
        data: {
          status: 'PAID',
          paymentStatus: 'PAID',
          paymentIntentId: session.payment_intent as string,
          // Use Stripe's actual charged amount (accounts for any promotion codes applied at Stripe)
          total: (session.amount_total ?? 0) / 100,
          paidAt: new Date(),
        },
        include: {
          items: true,
          user: { select: { email: true, name: true } },
        },
      });

      // Increment coupon usage if applicable
      if (order.couponCode) {
        await prisma.coupon.update({
          where: { code: order.couponCode },
          data: { usageCount: { increment: 1 } },
        });
      }

      // Increment soldCount on products
      for (const item of order.items) {
        if (item.productId) {
          await prisma.product.update({
            where: { id: item.productId },
            data: { soldCount: { increment: item.quantity } },
          }).catch(() => {}); // Don't fail order if this errors
        }
      }

      // Add status history
      await prisma.orderStatusHistory.create({
        data: { orderId: order.id, status: 'PAID', note: 'Payment confirmed via Stripe' },
      });

      // Send confirmation email
      const customerEmail = session.customer_email || order.user?.email;
      if (customerEmail) {
        await sendOrderConfirmationEmail(
          customerEmail,
          order.orderNumber,
          order.items.map(item => ({
            name: item.productName,
            quantity: item.quantity,
            price: Number(item.price),
          })),
          Number(order.total),
          order.user?.name || meta.userId ? '' : 'Customer'
        ).catch(console.error);
      }
    } catch (err) {
      console.error('Order update failed:', err);
    }
  }

  return NextResponse.json({ received: true });
}
