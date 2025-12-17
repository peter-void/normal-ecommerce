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

    const updateOrder = await prisma.order.update({
      where: {
        id: midtransData.order_id,
      },
      data: {
        status:
          midtransData.transaction_status === "settlement"
            ? OrderStatus.PAID
            : OrderStatus.PENDING,
        paymentMethod: midtransData.payment_type,
        paymentStatus: midtransData.transaction_status,
      },
    });

    const getOrder = await prisma.order.findUnique({
      where: {
        id: midtransData.order_id,
      },
      select: {
        orderItems: {
          select: {
            productId: true,
            quantity: true,
          },
        },
      },
    });

    if (!getOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    await Promise.all(
      getOrder.orderItems.map((item) =>
        prisma.product.update({
          where: {
            id: item.productId,
          },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        })
      )
    );

    return NextResponse.json({ test: "data" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
