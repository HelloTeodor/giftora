import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { isStaff } from '@/lib/utils';
import { prisma } from '@/lib/prisma';
import { sendShippingNotificationEmail } from '@/lib/email';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || !isStaff(session.user.role)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  try {
    const { status, trackingNumber, trackingUrl, note } = await req.json();

    const updateData: Record<string, unknown> = {
      status,
      ...(trackingNumber && { trackingNumber }),
      ...(trackingUrl && { trackingUrl }),
      ...(status === 'SHIPPED' && { shippedAt: new Date() }),
      ...(status === 'DELIVERED' && { deliveredAt: new Date() }),
      ...(status === 'CANCELLED' && { cancelledAt: new Date() }),
    };

    const order = await prisma.order.update({
      where: { id },
      data: updateData,
      include: { user: true },
    });

    await prisma.orderStatusHistory.create({
      data: {
        orderId: id,
        status: status as any,
        note: note || null,
        createdBy: session.user.id,
      },
    });

    // Send shipping notification
    if (status === 'SHIPPED' && trackingNumber && (order.user?.email || order.guestEmail)) {
      const email = order.user?.email || order.guestEmail!;
      await sendShippingNotificationEmail(
        email,
        order.orderNumber,
        trackingNumber,
        trackingUrl || '#',
        order.user?.name || undefined
      ).catch(console.error);
    }

    return NextResponse.json({ data: order });
  } catch {
    return NextResponse.json({ error: 'Status update failed' }, { status: 500 });
  }
}
