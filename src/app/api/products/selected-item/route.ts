import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { productId, cartId } = body;

    const isAlreadySelected = await prisma.selectedItem.findFirst({
      where: {
        AND: [
          {
            cartId,
          },
          {
            productId,
          },
        ],
      },
    });

    if (!isAlreadySelected) {
      await prisma.selectedItem.create({
        data: {
          cartId,
          productId,
        },
      });
    }

    if (isAlreadySelected) {
      await prisma.selectedItem.delete({
        where: {
          id: isAlreadySelected.id,
        },
      });
    }

    return NextResponse.json({
      message: "Selected item updated successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
