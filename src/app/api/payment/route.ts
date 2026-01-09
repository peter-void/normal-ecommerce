import { OrderStatus } from "@/generated/prisma/enums";
import { auth } from "@/lib/auth";
import { snap } from "@/lib/midtrans";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { totalAmount, productDetails } = body;

  let orderId = "";
  let userId = "";

  try {
    await prisma.$transaction(
      async (tx) => {
        const session = await auth.api.getSession({
          headers: await headers(),
        });

        if (!session?.user) {
          throw new Error("UNAUTHORIZED");
        }

        const user = session.user;

        userId = user.id;

        for (const productDetail of productDetails) {
          const products = await tx.$queryRaw<
            {
              id: string;
              stock: number;
              price: number;
            }[]
          >`
        SELECT id, stock, price FROM products WHERE id = ${productDetail.productId} FOR UPDATE`;

          const product = products[0];

          if (!product) {
            throw new Error("PRODUCT_NOT_FOUND");
          }

          if (product.stock < productDetail.quantity) {
            throw new Error("INSUFFICIENT_STOCK");
          }

          await tx.product.update({
            where: {
              id: productDetail.productId,
            },
            data: {
              stock: {
                decrement: productDetail.quantity,
              },
            },
          });
        }

        const getUserMainAddress = await tx.address.findFirst({
          where: {
            userId: user.id,
            mainAddress: true,
          },
        });

        if (!getUserMainAddress) {
          throw new Error("MAIN_ADDRESS_NOT_FOUND");
        }

        const order = await tx.order.create({
          data: {
            userId: user.id,
            totalAmount,
            addressId: getUserMainAddress.id,
            status: OrderStatus.PENDING,
          },
        });

        orderId = order.id;

        await tx.orderItem.createMany({
          data: productDetails.map((item: any) => ({
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
          })),
        });
      },
      {
        maxWait: 5000,
        timeout: 10000,
      }
    );

    let parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: totalAmount,
      },
      item_details: productDetails.map((item: any) => ({
        id: item.productId,
        price: Number(item.price),
        quantity: item.quantity,
        name: item.name,
      })),
      credit_card: {
        secure: true,
      },
      customer_details: {
        id: userId,
      },
      callbacks: {
        finish: `${process.env.NEXT_PUBLIC_APP_URL}/cart/checkout`,
      },
    };
    const token = await snap.createTransaction(parameter);

    return NextResponse.json(token);
  } catch (error: any) {
    console.error(error.message);

    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json("Unauthorized", {
        status: 401,
      });
    }

    if (
      error.message === "PRODUCT_NOT_FOUND" ||
      error.message === "INSUFFICIENT_STOCK" ||
      error.message === "MAIN_ADDRESS_NOT_FOUND"
    ) {
      return NextResponse.json(error.message, {
        status: 400,
      });
    }

    return NextResponse.json("Internal Server Error", {
      status: 500,
    });
  }
}
