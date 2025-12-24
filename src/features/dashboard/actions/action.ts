"use server";

import { PAGE_SIZE } from "@/constants";
import { formatRupiah } from "@/lib/format";
import prisma from "@/lib/prisma";
import { startOfMonth, endOfMonth, subMonths, format } from "date-fns";

export async function getDashboardStats(startDate?: Date, endDate?: Date) {
  const now = new Date();
  const startOfCurrentMonth = startOfMonth(now);
  const endOfCurrentMonth = endOfMonth(now);
  const startOfPreviousMonth = startOfMonth(subMonths(now, 1));
  const endOfPreviousMonth = endOfMonth(subMonths(now, 1));

  const dateFilter =
    startDate && endDate
      ? {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        }
      : {};

  const totalRevenue = await prisma.order.aggregate({
    where: {
      status: {
        in: ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"],
      },
      ...dateFilter,
    },
    _sum: {
      totalAmount: true,
    },
  });

  const currentMonthRevenue = await prisma.order.aggregate({
    where: {
      status: {
        in: ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"],
      },
      createdAt: {
        gte: startOfCurrentMonth,
        lte: endOfCurrentMonth,
      },
    },
    _sum: {
      totalAmount: true,
    },
  });

  const previousMonthRevenue = await prisma.order.aggregate({
    where: {
      status: {
        in: ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"],
      },
      createdAt: {
        gte: startOfPreviousMonth,
        lte: endOfPreviousMonth,
      },
    },
    _sum: {
      totalAmount: true,
    },
  });

  const balance = totalRevenue._sum.totalAmount || 0;
  const moneyIn = currentMonthRevenue._sum.totalAmount || 0;
  const prevMoneyIn = previousMonthRevenue._sum.totalAmount || 0;

  const balanceProgress = Math.min((Number(balance) / 100000) * 100, 100);
  const moneyInProgress = Math.min((Number(moneyIn) / 100000) * 100, 100);

  return {
    balance: {
      value: balance,
      progress: balanceProgress,
    },
    moneyIn: {
      value: moneyIn,
      progress: moneyInProgress,
      previousValue: prevMoneyIn,
    },
  };
}

export async function getSalesChartData(startDate?: Date, endDate?: Date) {
  const now = new Date();
  const monthsData = [];

  for (let i = 7; i >= 0; i--) {
    const monthDate = subMonths(now, i);
    const monthStart = startOfMonth(monthDate);
    const monthEnd = endOfMonth(monthDate);

    if (startDate && endDate) {
      if (monthEnd < startDate || monthStart > endDate) {
        continue;
      }
    }

    const salesData = await prisma.order.aggregate({
      where: {
        status: {
          in: ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"],
        },
        createdAt: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
      _sum: {
        totalAmount: true,
      },
      _count: true,
    });

    const customersData = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
      select: {
        userId: true,
      },
      distinct: ["userId"],
    });

    monthsData.push({
      name: format(monthDate, "MMM"),
      sales: Number(salesData._sum.totalAmount || 0),
      customers: customersData.length,
    });
  }

  return monthsData;
}

export async function getLatestSales(
  startDate?: Date,
  endDate?: Date,
  page: number = 1,
  limit: number = PAGE_SIZE
) {
  const dateFilter =
    startDate && endDate
      ? {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        }
      : {};

  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where: dateFilter,
      take: PAGE_SIZE,
      skip,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        orderItems: {
          take: 1,
          include: {
            product: {
              include: {
                images: {
                  take: 1,
                },
              },
            },
          },
        },
      },
    }),
    prisma.order.count({
      where: dateFilter,
    }),
  ]);

  const count = await prisma.order.count({
    where: dateFilter,
  });

  const totalPages = Math.ceil(count / limit);

  const data = orders.map((order) => {
    const firstItem = order.orderItems[0];
    const product = firstItem?.product;
    const image = product?.images[0];

    return {
      id: order.id,
      name: product?.name || "Order",
      date: format(order.createdAt, "dd MMM yyyy"),
      amount: formatRupiah(order.totalAmount),
      status:
        order.status === "PAID" || order.status === "DELIVERED"
          ? "Paid"
          : "Pending",
      image:
        image?.src ||
        "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=100&h=100&fit=crop",
    };
  });

  return {
    data,
    meta: {
      total,
      page,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
}

export async function getRecentCustomers(
  page: number = 1,
  limit: number = PAGE_SIZE,
  search?: string
) {
  const skip = (page - 1) * limit;

  const whereClause = {
    orders: {
      some: {},
    },
    ...(search
      ? {
          name: {
            contains: search,
            mode: "insensitive" as const,
          },
        }
      : {}),
  };

  const [customers, total] = await Promise.all([
    prisma.user.findMany({
      where: whereClause,
      take: PAGE_SIZE,
      skip,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        orders: {
          take: 1,
          orderBy: {
            createdAt: "desc",
          },
          include: {
            orderItems: {
              take: 1,
              include: {
                product: true,
              },
            },
          },
        },
      },
    }),
    prisma.user.count({
      where: whereClause,
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  const data = customers.map((customer) => {
    const latestOrder = customer.orders[0];
    const product = latestOrder?.orderItems[0]?.product;

    return {
      name: customer.name,
      date: latestOrder ? format(latestOrder.createdAt, "dd MMM yyyy") : "N/A",
      amount: latestOrder?.totalAmount || 0,
      category: product?.name || "General",
    };
  });

  return {
    data,
    meta: {
      total,
      page,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
}
