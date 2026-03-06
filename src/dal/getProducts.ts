import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { serializeProduct } from "@/lib/utils";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function getProductByKey(key: string) {
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
  search,
  status,
}: {
  take: number;
  skip: number;
  search?: string;
  status?: string;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return redirect("/signin");
  }

  const where = {
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            {
              category: {
                name: { contains: search, mode: "insensitive" as const },
              },
            },
          ],
        }
      : {}),
    ...(status === "active"
      ? { isActive: true }
      : status === "draft"
        ? { isActive: false }
        : {}),
  };

  const products = await prisma.product.findMany({
    take,
    skip,
    where,
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
      },
    },
  });

  const total = await prisma.product.count({ where });

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

export async function getRelatedProducts(
  categoryId: string,
  currentProductId: string,
  limit: number = 4,
) {
  const products = await prisma.product.findMany({
    where: {
      categoryId,
      id: {
        not: currentProductId,
      },
      isActive: true,
    },
    take: limit,
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
          isMain: true,
        },
      },
    },
  });

  const serializedProducts = products.map((product) => ({
    ...product,
    ...serializeProduct(product),
  }));

  return serializedProducts;
}
