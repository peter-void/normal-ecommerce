"server-only";

import { GetAllProductsProps } from "@/app/(consumer)/products/page";
import { ITEMS_PER_PAGE, SortOption } from "@/constants";
import prisma from "@/lib/prisma";
import { serializeProduct } from "@/lib/utils";

export async function getAllProducts(
  cursor?: string,
  sort?: string,
  q?: string
) {
  let orderBy = {};

  switch (sort) {
    case SortOption.NEWEST:
      orderBy = {
        createdAt: "desc",
      };
      break;
    case SortOption.PRICE_ASC:
      orderBy = {
        price: "asc",
      };
      break;
    case SortOption.PRICE_DESC:
      orderBy = {
        price: "desc",
      };
      break;
    default:
      orderBy = {
        createdAt: "desc",
      };
      break;
  }

  const products = await prisma.product.findMany({
    ...(q && {
      where: {
        OR: [
          {
            name: {
              contains: q,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: q,
              mode: "insensitive",
            },
          },
        ],
      },
    }),
    orderBy,
    include: {
      images: true,
      category: true,
    },
    take: ITEMS_PER_PAGE + 1,
    ...(cursor && {
      cursor: { id: cursor },
      skip: 1,
    }),
  });

  const hasMore = products.length > ITEMS_PER_PAGE;
  const items = hasMore ? products.slice(0, -1) : products;
  const nextCursor = hasMore ? products[ITEMS_PER_PAGE - 1].id : undefined;

  const serializedItems = items.map((item) => serializeProduct(item));

  return {
    items: serializedItems as GetAllProductsProps[],
    nextCursor,
    hasMore,
  };
}
