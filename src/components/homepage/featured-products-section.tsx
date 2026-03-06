import prisma from "@/lib/prisma";
import { serializeProduct } from "@/lib/utils";
import { ProductEditProps } from "@/types";
import Link from "next/link";
import { FeaturedProductsClient } from "./featured-products-client";

async function getFeaturedProducts() {
  const products = await prisma.product.findMany({
    where: {
      AND: [{ isActive: true }, { isFeatured: true }],
    },
    take: 6,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      images: true,
      category: true,
    },
  });

  const serializedProducts = products.map((product) =>
    serializeProduct(product),
  );

  return serializedProducts;
}

export async function FeaturedProductsSection() {
  const products =
    (await getFeaturedProducts()) as ProductEditProps["product"][];

  return (
    <section className="bg-white py-16 px-4 md:px-7">
      <div className="container mx-auto">
        <FeaturedProductsClient initialProducts={products as any} />
      </div>
    </section>
  );
}
