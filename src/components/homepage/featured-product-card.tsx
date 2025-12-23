"use client";

import { addToCart } from "@/features/carts/actions/action";
import { formatRupiah } from "@/lib/format";
import { ProductEditProps } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { GetAllProductsProps } from "@/app/(consumer)/products/page";

interface FeaturedProductCardProps {
  product: GetAllProductsProps;
}

export function FeaturedProductCard({ product }: FeaturedProductCardProps) {
  const [isPending, startTransition] = useTransition();

  const handleAddToCart = async () => {
    startTransition(async () => {
      const { message, success } = await addToCart(product.id, 1);

      if (!success) {
        toast.error(message);
      }
    });
  };

  return (
    <Link href={`/product/${product.slug}`} className="block h-full">
      <div className="group flex flex-col h-full bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 relative overflow-hidden">
        {/* Category Tag */}
        <div className="absolute top-4 left-4 z-20 pointer-events-none transform -rotate-6 transition-transform group-hover:rotate-0">
          <div className="bg-pink-500 border-4 border-black px-3 py-1 text-white font-black text-xs uppercase shadow-sm">
            {product.category.name}
          </div>
        </div>

        {/* Image Container */}
        <div className="relative aspect-4/3 border-b-4 border-black overflow-hidden bg-gray-100 p-8">
          <div className="relative w-full h-full transition-transform duration-500 group-hover:scale-110">
            {product.images?.[0] ? (
              <Image
                src={product.images[0].src}
                alt={product.name}
                fill
                unoptimized
                className="object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold uppercase">
                No Image
              </div>
            )}
          </div>
        </div>

        {/* Content Container */}
        <div className="p-6 flex flex-col grow gap-6 relative bg-white">
          {/* Texture */}
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px] pointer-events-none" />

          <div className="space-y-3 grow relative z-10">
            <h3
              className="text-3xl font-black uppercase leading-none tracking-tight line-clamp-2"
              title={product.name}
            >
              {product.name}
            </h3>
          </div>

          <div className="relative z-10 pt-4 border-t-4 border-black flex flex-col gap-4">
            <div className="flex justify-between items-end">
              <div className="font-bold text-xs uppercase text-gray-500 tracking-wider">
                Price
              </div>
              <div className="text-3xl font-black tabular-nums tracking-tighter">
                {formatRupiah(product.price!.toString())}
              </div>
            </div>

            <Button
              disabled={isPending}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                handleAddToCart();
              }}
              className="w-full h-14 bg-black text-white text-lg font-black uppercase tracking-widest border-4 border-transparent hover:bg-[#A855F7] hover:border-black hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] disabled:opacity-70 disabled:hover:shadow-none disabled:hover:translate-x-0"
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Adding...
                </span>
              ) : (
                "Add to Cart +"
              )}
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
