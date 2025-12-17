import { formatRupiah } from "@/lib/format";
import prisma from "@/lib/prisma";
import { serializeProduct } from "@/lib/utils";
import { ProductEditProps } from "@/types";
import { ShoppingCart, Star } from "lucide-react";
import { Button } from "../ui/button";
import { FeaturedProductCard } from "./featured-product-card";
import Image from "next/image";

async function getFeaturedProducts() {
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
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
    serializeProduct(product)
  );

  return serializedProducts;
}

export async function FeaturedProductsSection() {
  const products =
    (await getFeaturedProducts()) as ProductEditProps["product"][];

  return (
    <section className="relative py-20 px-4 md:px-7 overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 bg-[radial-gradient(#000_2px,transparent_2px)] bg-size-[30px_30px] opacity-10 pointer-events-none" />

      <div className="container mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-8">
          <div>
            <div className="relative inline-block mb-4">
              <div className="absolute inset-0 bg-white border-4 border-black translate-x-1 translate-y-1" />
              <div className="relative bg-black text-white font-black text-sm px-4 py-1 uppercase border-4 border-black flex items-center gap-2 transform -rotate-2">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                Handpicked For You
              </div>
            </div>

            <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] italic pr-4">
              Featured
              <br />
              <span className="pb-2 text-blue-500">Products</span>
            </h2>
          </div>

          <Button
            variant="noShadow"
            asChild
            className="bg-white border-4 border-black font-black h-16 px-10 text-xl uppercase shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
          >
            <a href="/products">View All</a>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {products.map((product) => (
            <FeaturedProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
