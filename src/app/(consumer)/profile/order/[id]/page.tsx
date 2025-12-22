import { getUserOrderDetails } from "@/dal/getOrders";
import { OrderDetailsContent } from "@/features/orders/components/order-details-content";
import { Prisma } from "@/generated/prisma/client";

export type OrderWithItems = Prisma.OrderGetPayload<{
  include: {
    user: {
      include: {
        addresses: {
          where: {
            mainAddress: true;
          };
        };
      };
    };
    orderItems: {
      include: {
        product: {
          include: {
            category: true;
            images: true;
          };
        };
      };
    };
  };
}>;

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const orderDetails: OrderWithItems = await getUserOrderDetails(id);

  return <OrderDetailsContent order={orderDetails} />;
}
