"use server";

import prisma from "@/lib/prisma";
import { OrderStatus } from "@/generated/prisma/client";
import { revalidatePath } from "next/cache";
import { PAGE_SIZE } from "@/constants";

export async function getAdminOrders({
  page = 1,
  limit = PAGE_SIZE,
  search = "",
}: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  const skip = (page - 1) * limit;

  const where = search
    ? {
        OR: [
          { id: { contains: search, mode: "insensitive" } as any },
          { user: { name: { contains: search, mode: "insensitive" } } },
          { user: { email: { contains: search, mode: "insensitive" } } },
        ],
      }
    : {};

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where: where as any,
      include: {
        user: true,
        address: true,
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
      take: limit,
      skip,
    }),
    prisma.order.count({ where: where as any }),
  ]);

  const serializedOrders = orders.map((order) => {
    const { orderItems, ...restOrder } = order;
    return {
      ...restOrder,
      orderItems: orderItems.map((item) => {
        const { product, ...restItem } = item;
        return {
          ...restItem,
          product: {
            ...product,
            price: Number(product.price),
            weight: product.weight ? Number(product.weight) : null,
          },
        };
      }),
    };
  });

  const [totalRevenue, pendingOrders, shippedOrders, deliveredOrders] =
    await Promise.all([
      prisma.order.aggregate({
        _sum: { totalAmount: true },
      }),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.order.count({ where: { status: "SHIPPED" } }),
      prisma.order.count({ where: { status: "DELIVERED" } }),
    ]);

  return {
    orders: serializedOrders,
    metadata: {
      hasNextPage: skip + limit < total,
      totalPages: Math.ceil(total / limit),
      totalOrders: total,
    },
    stats: {
      totalRevenue: Number(totalRevenue._sum.totalAmount || 0),
      pending: pendingOrders,
      shipped: shippedOrders,
      delivered: deliveredOrders,
    },
  };
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error) {
    console.error("Failed to update order status:", error);
    return { success: false, error: "Failed to update status" };
  }
}
