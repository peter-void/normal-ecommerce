import { OrderStatus } from "@/generated/prisma/enums";
import { snap } from "@/lib/midtrans";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/*
RESPONSE 

{
  status_code: '200',
  transaction_id: '9b6ffa28-7dcf-483a-b3d5-c449816940c7',
  gross_amount: '126490000.00',
  currency: 'IDR',
  order_id: 'cmj8lqlfq0000i0ts684dty0n',
  payment_type: 'bank_transfer',
  signature_key: '8e537322700ec1545b8fc0f4caa70fc79d449817bd552e1c10fc80a6c4a277734e473da2f52ff9c4bbf211ce8930dd8e351267c9db37e35fca3876656e06224a',
  transaction_status: 'settlement',
  fraud_status: 'accept',
  status_message: 'Success, transaction is found',
  merchant_id: 'G346924433',
  va_numbers: [ { bank: 'bca', va_number: '24433646659683662833371' } ],
  payment_amounts: [],
  transaction_time: '2025-12-16 20:12:20',
  settlement_time: '2025-12-16 20:12:57',
  expiry_time: '2025-12-17 20:12:20'
}
*/

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const midtransData = await (snap as any).transaction.notification(body);

    let status: OrderStatus = OrderStatus.PENDING;

    if (midtransData.transaction_status === "settlement") {
      status = OrderStatus.PAID;
    } else if (midtransData.transaction_status === "pending") {
      status = OrderStatus.PENDING;
    } else if (midtransData.transaction_status === "expire") {
      status = OrderStatus.EXPIRED;
    } else if (midtransData.transaction_status === "cancel") {
      status = OrderStatus.CANCELLED;
    }

    await prisma.$transaction(
      async (tx) => {
        const getOrder = await tx.order.findUnique({
          where: {
            id: midtransData.order_id,
          },
          include: {
            orderItems: true,
          },
        });

        if (!getOrder) {
          throw new Error("ORDER_NOT_FOUND");
        }

        // IDEMPOTENCY CHECK
        if (getOrder.status === OrderStatus.PAID) {
          return;
        }

        await tx.order.update({
          where: {
            id: midtransData.order_id,
          },
          data: {
            status: status!,
            paymentMethod: midtransData.payment_type,
            paymentStatus: midtransData.transaction_status,
          },
        });

        if (
          status === OrderStatus.EXPIRED ||
          status === OrderStatus.CANCELLED
        ) {
          for (const orderProduct of getOrder.orderItems) {
            await tx.product.update({
              where: {
                id: orderProduct.productId,
              },
              data: {
                stock: {
                  increment: orderProduct.quantity,
                },
              },
            });
          }

          return;
        }
      },
      {
        maxWait: 5000,
        timeout: 60000,
      }
    );

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error(error.message);

    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
