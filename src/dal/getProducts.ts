import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { serializeProduct } from "@/lib/utils";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function getProductByKey(key: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return redirect("/signin");
  }

  const products = await prisma.product.findFirst({
    where: {
      OR: [
        {
          id: key,
        },
        {
          slug: key,
        },
      ],
    },
    include: {
      category: true,
      images: true,
    },
  });

  const serializedProducts = serializeProduct(products);

  return serializedProducts;
}

export async function getProducts({
  take,
  skip,
}: {
  take: number;
  skip: number;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return redirect("/signin");
  }

  const products = await prisma.product.findMany({
    take,
    skip,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      category: {
        select: {
          name: true,
        },
      },
      images: {
        select: {
          id: true,
          key: true,
          alt: true,
          src: true,
        },
        take: 1,
      },
    },
  });

  const total = await prisma.product.count();

  const serializedProducts = products.map((product) => ({
    ...product,
    ...serializeProduct(product),
  }));

  return {
    data: serializedProducts,
    metadata: {
      hasNextPage: take + skip < total,
      totalPages: Math.ceil(total / take),
    },
  };
}
