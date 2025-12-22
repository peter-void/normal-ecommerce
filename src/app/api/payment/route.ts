import { auth } from "@/lib/auth";
import { snap } from "@/lib/midtrans";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json("Unauthorized", {
        status: 401,
      });
    }

    const body = await req.json();

    const user = session.user;

    const { totalAmount, productDetails } = body;

    const getUserMainAddress = await prisma.address.findFirst({
      where: {
        userId: user.id,
        mainAddress: true,
      },
    });

    if (!getUserMainAddress) {
      return NextResponse.json("Main address not found", {
        status: 404,
      });
    }

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        totalAmount,
        addressId: getUserMainAddress.id,
      },
    });

    await prisma.orderItem.createMany({
      data: productDetails.map((item: any) => ({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
      })),
    });

    let parameter = {
      transaction_details: {
        order_id: order.id,
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
        id: user.id,
      },
      callbacks: {
        finish: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
        unfinish: `${process.env.NEXT_PUBLIC_APP_URL}/payment/pending`,
        error: `${process.env.NEXT_PUBLIC_APP_URL}/payment/failed`,
      },
    };

    const token = await snap.createTransaction(parameter);

    return NextResponse.json(token);
  } catch (error) {
    console.log(error);
    return NextResponse.json("Internal Server Error", {
      status: 500,
    });
  }
}
