import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { serializeProduct } from "@/lib/utils";
import { headers } from "next/headers";

export async function getSelectedCartProduct() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const cart = await prisma.cart.findFirst({
    where: {
      userId: session?.user.id,
    },
  });

  const selectedCartProduct = await prisma.selectedItem.findMany({
    where: {
      cartId: cart?.id,
    },
    include: {
      product: true,
    },
  });

  const serializedSelectedCartProduct = selectedCartProduct.map((item) => ({
    ...item,
    product: serializeProduct(item.product),
  }));

  return serializedSelectedCartProduct;
}
