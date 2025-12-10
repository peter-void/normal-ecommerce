"use client";

import { formatRupiah } from "@/lib/format";
import { ProductEditProps } from "@/types";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";
import { addToCart } from "@/features/carts/actions/action";
import { toast } from "sonner";
import { useTransition } from "react";

interface FeaturedProductCardProps {
  product: ProductEditProps["product"];
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
    <div className="group flex flex-col h-full border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200">
      {/* Image Container */}
      <div className="relative aspect-4/3 border-b-4 border-black overflow-hidden bg-gray-100 cursor-crosshair">
        <div className="absolute top-4 left-4 z-10 pointer-events-none">
          <div className="bg-yellow-400 border-2 border-black px-3 py-1 text-xs font-black uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            {product.category.name}
          </div>
        </div>

        {product.images?.[0] ? (
          <Image
            src={product.images[0].src}
            alt={product.name}
            fill
            unoptimized
            className="object-cover transition-transform duration-200 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold uppercase">
            No Image
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="p-6 flex flex-col grow gap-4">
        <div className="space-y-2 grow">
          <h3
            className="text-2xl font-black uppercase leading-tight line-clamp-1"
            title={product.name}
          >
            {product.name}
          </h3>
          <p className="text-sm font-medium text-gray-600 line-clamp-2 leading-relaxed border-l-4 border-gray-300 pl-3">
            {product.description ||
              "No description available for this product."}
          </p>
        </div>

        <div className="pt-4 border-t-2 border-black border-dashed flex items-end justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
              Price
            </div>
            <div className="text-2xl font-black bg-black text-white px-2 py-1 -ml-1 transform -rotate-2 inline-block">
              {formatRupiah(product.price)}
            </div>
          </div>

          <Button className="h-12 w-12 p-0 rounded-none border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all bg-purple-500 hover:bg-purple-600 text-white flex items-center justify-center">
            <ShoppingCart className="size-5" />
          </Button>
        </div>

        <Button
          className="w-full bg-white text-black border-2 border-black font-bold uppercase tracking-wide h-12 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-gray-50 transition-all flex items-center justify-center gap-2 group/btn"
          onClick={handleAddToCart}
          disabled={isPending}
        >
          {isPending ? "Adding to cart..." : "Add to Cart"}
        </Button>
      </div>
    </div>
  );
}
