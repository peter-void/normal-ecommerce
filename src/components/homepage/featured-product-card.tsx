"use client";

import { addToCart } from "@/features/carts/actions/action";
import { formatRupiah } from "@/lib/format";
import Image from "next/image";
import Link from "next/link";
import { GetAllProductsProps } from "@/app/(consumer)/products/page";
import { Heart, ShoppingBag } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

interface FeaturedProductCardProps {
  product: GetAllProductsProps;
}

export function FeaturedProductCard({ product }: FeaturedProductCardProps) {
  const [isPending, startTransition] = useTransition();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    startTransition(async () => {
      const { message, success } = await addToCart(product.id, 1);
      if (!success) {
        toast.error(message);
      } else {
        toast.success("Added to cart!");
      }
    });
  };

  return (
    <div className="group flex flex-col bg-white border-2 border-transparent hover:border-black transition-colors duration-200">
      {/* Image Container */}
      <div className="relative">
        {/* Favorite Icon — always visible */}
        <button
          className="absolute top-3 right-3 z-20 bg-white rounded-full p-1.5 hover:bg-gray-100 transition-colors"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <Heart className="w-4 h-4 text-black" strokeWidth={1.5} />
        </button>

        <Link href={`/product/${product.slug}`} className="block">
          {/* overflow-hidden clips the Quick Add slide-up */}
          <div className="relative aspect-square overflow-hidden bg-white">
            {product.images?.[0] ? (
              <Image
                src={product.images[0].src}
                alt={product.name}
                fill
                unoptimized
                className="object-cover transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold uppercase text-sm">
                No Image
              </div>
            )}

            {/* Quick Add — slides up from bottom, clipped by overflow-hidden */}
            <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
              <div
                onClick={handleAddToCart}
                className="w-full bg-black text-white text-[11px] font-bold uppercase tracking-[0.15em] py-3 flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors cursor-pointer"
              >
                {isPending ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-3.5 h-3.5" />
                    Quick Add
                  </>
                )}
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Content */}
      <div className="pt-3 pb-4 px-3 flex flex-col gap-1">
        <p className="text-black font-bold text-sm">
          {formatRupiah(product.price!.toString())}
        </p>

        <Link href={`/product/${product.slug}`}>
          <h3
            className="text-sm line-clamp-2 text-black transition-colors"
            title={product.name}
          >
            {product.name}
          </h3>
        </Link>

        <p className="text-gray-500 text-[13px]">{product.category.name}</p>
      </div>
    </div>
  );
}
