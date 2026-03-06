"use client";

import { addToCart } from "@/features/carts/actions/action";
import { updateWishlist } from "@/features/wishlist/actions/action";
import {
  Category,
  Image as PrismaImage,
  Product,
  Wishlist,
} from "@/generated/prisma/client";
import { formatRupiah } from "@/lib/format";
import { cn } from "@/lib/utils";
import { ShoppingCart, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export type WishlistItemExtended = Wishlist & {
  product: Product & {
    images: PrismaImage[];
    category: Category;
  };
};

interface WishlistCardProps {
  item: WishlistItemExtended;
  onRemove: (id: string) => void;
}

export function WishlistCard({ item, onRemove }: WishlistCardProps) {
  const [isPending, startTransition] = useTransition();
  const [isRemoving, startRemoving] = useTransition();

  const handleAddToCart = async () => {
    startTransition(async () => {
      const { message, success } = await addToCart(item.product.id, 1);
      if (!success) {
        toast.error(message);
      } else {
        toast.success(message);
      }
    });
  };

  const handleRemove = async () => {
    startRemoving(async () => {
      const { success, message } = await updateWishlist(item.product.id);
      if (success) {
        onRemove(item.id);
        toast.success(message);
      } else {
        toast.error(message);
      }
    });
  };

  return (
    <div className="group relative flex flex-col h-full bg-white border-2 border-transparent hover:border-black transition-colors duration-200">
      {/* Delete button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          handleRemove();
        }}
        disabled={isRemoving}
        className="absolute top-3 right-3 z-20 h-8 w-8 flex items-center justify-center bg-white border border-gray-200 hover:border-black hover:bg-gray-50 transition-colors"
        title="Remove from wishlist"
      >
        <Trash2 className="h-3.5 w-3.5 text-black" />
      </button>

      {/* Product Image */}
      <Link
        href={`/product/${item.product.slug}`}
        className="block relative aspect-square overflow-hidden bg-white"
      >
        {item.product.images?.[0] ? (
          <Image
            src={item.product.images[0].src}
            alt={item.product.name}
            fill
            unoptimized
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold uppercase text-sm">
            No Image
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-col grow px-3 pt-3 pb-4 space-y-3">
        {/* Category */}
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
          {item.product.category.name}
        </span>

        {/* Product Name */}
        <Link href={`/product/${item.product.slug}`} className="block">
          <h3 className="font-bold text-sm uppercase leading-snug line-clamp-2 text-black hover:underline underline-offset-2">
            {item.product.name}
          </h3>
        </Link>

        {/* Price + Button */}
        <div className="mt-auto pt-3 border-t border-gray-100 flex flex-col gap-2">
          <p className="text-black font-bold text-base">
            {formatRupiah(item.product.price.toString())}
          </p>

          <Button
            className="w-full h-10 bg-black text-white hover:bg-gray-800 rounded-none border-none font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-colors"
            onClick={handleAddToCart}
            disabled={isPending}
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            {isPending ? "Adding..." : "Add to Cart"}
          </Button>
        </div>
      </div>
    </div>
  );
}
