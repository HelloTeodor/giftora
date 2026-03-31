import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { isAdmin } from '@/lib/utils';
import { prisma } from '@/lib/prisma';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || !isAdmin(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    // Delete ReturnRequests first (no cascade)
    await prisma.returnRequest.deleteMany({ where: { orderId: id } });

    // Delete the order (OrderItems + OrderStatusHistory cascade)
    await prisma.order.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Delete order error:', err);
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
  }
}
