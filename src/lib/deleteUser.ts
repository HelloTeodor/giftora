import { prisma } from '@/lib/prisma';

/**
 * Permanently deletes a user and all their data.
 * - Relations with onDelete: Cascade auto-delete (Account, Session, Address,
 *   CartItem, WishlistItem, Review, LoginActivity, Notification, etc.)
 * - Non-cascade nullable relations are nullified (Order.userId, SupportTicket.userId, etc.)
 * - Non-cascade non-nullable relations are deleted first (ReturnRequest, AffiliateEarning)
 */
export async function hardDeleteUser(userId: string) {
  // 1. Nullify nullable foreign keys that don't cascade
  await prisma.order.updateMany({
    where: { userId },
    data: { userId: null },
  });

  // 2. Delete non-nullable relations that don't have onDelete: Cascade
  await prisma.returnRequest.deleteMany({ where: { userId } });
  await prisma.notification.deleteMany({ where: { userId } });
  await prisma.affiliateEarning.deleteMany({ where: { userId } });

  // 3. Delete the user — cascade handles the rest
  await prisma.user.delete({ where: { id: userId } });
}
