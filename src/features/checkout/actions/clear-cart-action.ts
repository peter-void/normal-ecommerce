"use server";

import { OrderStatus } from "@/generated/prisma/enums";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

/**
 * Clears all cart items and selected items for the current user
 * after a successful payment. Only runs if the order is PAID.
 */
export async function clearCartAfterPayment(orderId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) return;

  // Verify the order belongs to this user and is actually PAID
  const order = await prisma.order.findUnique({
    where: { id: orderId, userId: session.user.id },
    select: { status: true },
  });

  if (!order || order.status !== OrderStatus.PAID) return;

  // Find the user's cart
  const cart = await prisma.cart.findFirst({
    where: { userId: session.user.id },
    select: { id: true },
  });

  if (!cart) return;

  // Delete all cart items and selected items in parallel
  await Promise.all([
    prisma.cartItem.deleteMany({ where: { cartId: cart.id } }),
    prisma.selectedItem.deleteMany({ where: { cartId: cart.id } }),
  ]);
  // No revalidatePath here — called during page render which forbids it.
  // Cart/checkout pages are server components that re-fetch on navigation naturally.
}
