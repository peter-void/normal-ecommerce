"use client";

import { Button } from "@/components/ui/button";
import { WishlistButton } from "@/components/wishlist-button";
import {
  addToCart,
  updateCartItemQuantity,
} from "@/features/carts/actions/action";
import { useCartItem } from "@/hooks/use-cart-item";
import { Minus, Plus, Share2, ShoppingBag } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

interface AddToCartFormProps {
  productId: string;
  stock: number;
  isWishlist: boolean;
}

export function AddToCartForm({
  productId,
  stock,
  isWishlist,
}: AddToCartFormProps) {
  const { cartItems } = useCartItem();
  const [isPending, startTransition] = useTransition();
  const [quantity, setQuantity] = useState(1);

  const increment = () => {
    if (quantity < stock) setQuantity((q) => q + 1);
  };

  const decrement = () => {
    if (quantity > 1) setQuantity((q) => q - 1);
  };

  const handleAddToCart = () => {
    const currentCartItem = cartItems.find(
      (cartItem) => cartItem.productId === productId
    );

    startTransition(async () => {
      if (currentCartItem) {
        await updateCartItemQuantity(
          currentCartItem.id,
          currentCartItem.quantity + quantity
        );
      } else {
        await addToCart(productId, quantity);
      }
    });
  };

  return (
    <div className="mt-8 space-y-8">
      <div className="space-y-3">
        <label className="text-sm font-black uppercase tracking-wider bg-black text-white px-2 py-1 w-fit">
          Quantity
        </label>
        <div className="flex items-center gap-6">
          <div className="flex items-center border-4 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <button
              onClick={decrement}
              disabled={quantity <= 1}
              className="flex h-14 w-14 items-center justify-center border-r-4 border-black hover:bg-yellow-400 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
            >
              <Minus className="h-6 w-6 stroke-[3px]" />
            </button>
            <div className="flex h-14 w-20 items-center justify-center font-black text-2xl">
              {quantity}
            </div>
            <button
              onClick={increment}
              disabled={quantity >= stock}
              className="flex h-14 w-14 items-center justify-center border-l-4 border-black hover:bg-yellow-400 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
            >
              <Plus className="h-6 w-6 stroke-[3px]" />
            </button>
          </div>
          <span className="text-sm font-bold text-neutral-600 uppercase tracking-tight">
            {stock > 0 ? `${stock} items available` : "Out of stock"}
          </span>
        </div>
      </div>

      <div className="flex gap-4 pt-4 border-t-4 border-black items-stretch">
        <Button
          className="flex-1 h-16 text-xl font-black uppercase tracking-widest border-4 border-black bg-cyan-400 text-black hover:bg-cyan-300 hover:translate-x-[2px] hover:translate-y-[-2px] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-y-0 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed group"
          disabled={stock === 0 || isPending}
          onClick={handleAddToCart}
        >
          {isPending ? (
            "Adding..."
          ) : (
            <span className="flex items-center gap-3">
              Add to Cart <ShoppingBag className="w-6 h-6 stroke-[3px]" />
            </span>
          )}
        </Button>

        <div className="flex gap-2">
          <WishlistButton productId={productId} isWishlist={isWishlist} />

          <button className="flex h-16 w-16 items-center justify-center border-4 border-black bg-pink-500 text-white hover:-translate-y-1 transition-transform">
            <Share2 className="h-7 w-7 stroke-[3px]" />
          </button>
        </div>
      </div>
    </div>
  );
}
