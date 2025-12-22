import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { serializeProduct } from "@/lib/utils";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function getUserOrderDetails(orderId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return redirect("/signin");
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId, userId: session.user.id },
    include: {
      user: {
        include: {
          addresses: {
            where: {
              mainAddress: true,
            },
          },
        },
      },
      orderItems: {
        include: {
          product: {
            include: {
              category: true,
              images: true,
            },
          },
        },
      },
    },
  });

  if (!order) {
    return redirect("/");
  }

  return {
    ...order,
    orderItems: order.orderItems.map((item) => ({
      ...item,
      product: serializeProduct(item.product),
    })),
  };
}

export async function getUserOrders() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return redirect("/signin");
  }

  // TODO: ADD ORDER INFINITE SCROLLING
  const orders = await prisma.order.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      orderItems: {
        include: {
          product: {
            include: {
              images: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const serializeProductT = orders.map((order) => ({
    ...order,
    orderItems: order.orderItems.map((item) => ({
      ...item,
      product: serializeProduct(item.product),
    })),
  }));

  return serializeProductT;
}

export async function getOrderDetails(orderId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return redirect("/signin");
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      orderItems: {
        include: {
          product: {
            include: {
              images: true,
            },
          },
        },
      },
    },
  });

  if (!order) {
    return redirect("/");
  }

  return order;
}
