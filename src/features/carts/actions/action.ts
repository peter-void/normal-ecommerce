"use server";

import { ITEMS_PER_PAGE } from "@/constants";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { serializeProduct } from "@/lib/utils";
import { ActionResponse, CartItemType } from "@/types";
import { headers } from "next/headers";

export async function fetchCartItems(cursor?: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { items: [], nextCursor: undefined, hasMore: false };
    }

    const existingCart = await prisma.cart.findFirst({
      where: { userId: session.user.id },
    });

    if (!existingCart) {
      return { items: [], nextCursor: undefined, hasMore: false };
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { cartId: existingCart.id },
      include: {
        product: {
          include: { images: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: ITEMS_PER_PAGE + 1,
      ...(cursor && {
        skip: 1,
        cursor: { id: cursor },
      }),
    });

    const hasMore = cartItems.length > ITEMS_PER_PAGE;

    const items = hasMore ? cartItems.slice(0, -1) : cartItems;

    const nextCursor =
      items.length > 0 ? items[items.length - 1].id : undefined;

    const serializedItems = items.map((item) => ({
      ...item,
      product: serializeProduct(item.product),
    })) as CartItemType[];

    return {
      items: serializedItems,
      nextCursor,
      hasMore,
    };
  } catch (error) {
    console.error("Error fetching cart items:", error);
    return { items: [], nextCursor: undefined, hasMore: false };
  }
}

export async function removeItem(cartItemId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) throw new Error("User not found");

    const existingCart = await prisma.cart.findFirst({
      where: {
        userId: session.user.id,
      },
    });

    if (!existingCart) throw new Error("Cart not found");

    await prisma.cartItem.delete({
      where: {
        id: cartItemId,
        cartId: existingCart.id,
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateCartItemQuantity(
  cartItemId: string,
  newQty: number
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) throw new Error("User not found");

    const existingCart = await prisma.cart.findFirst({
      where: {
        userId: session.user.id,
      },
    });

    if (!existingCart) throw new Error("Cart not found");

    await prisma.cartItem.update({
      where: {
        id: cartItemId,
      },
      data: {
        quantity: newQty,
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function addToCart(
  productId: string,
  quantity: number
): Promise<ActionResponse> {
  try {
    let message = "";

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    const existingInCart = await prisma.cart.findFirst({
      where: {
        userId: session.user.id,
      },
    });

    if (!existingInCart) {
      const createdCart = await prisma.cart.create({
        data: {
          userId: session.user.id,
        },
      });

      await prisma.cartItem.create({
        data: {
          productId,
          cartId: createdCart.id,
          quantity,
        },
      });

      message = "Successfully added to cart";
    } else {
      const existingItem = await prisma.cartItem.findFirst({
        where: {
          cartId: existingInCart.id,
          productId,
        },
      });

      if (existingItem) {
        await prisma.cartItem.update({
          where: {
            id: existingItem.id,
          },
          data: {
            quantity: existingItem.quantity + quantity,
          },
        });

        message = "Successfully updated quantity in cart";
      } else {
        await prisma.cartItem.create({
          data: {
            productId,
            cartId: existingInCart.id,
            quantity,
          },
        });

        message = "Successfully added to cart";
      }
    }

    return {
      success: true,
      message,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to add to cart",
    };
  }
}
