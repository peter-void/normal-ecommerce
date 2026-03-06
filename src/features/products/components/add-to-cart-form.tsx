"use client";

import { Button } from "@/components/ui/button";
import { WishlistButton } from "@/components/wishlist-button";
import {
  addToCart,
  updateCartItemQuantity,
} from "@/features/carts/actions/action";
import { useCartItem } from "@/hooks/use-cart-item";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { useTransition, useState } from "react";

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
      (cartItem) => cartItem.productId === productId,
    );

    startTransition(async () => {
      if (currentCartItem) {
        await updateCartItemQuantity(
          currentCartItem.id,
          currentCartItem.quantity + quantity,
        );
      } else {
        await addToCart(productId, quantity);
      }
    });
  };

  const isOutOfStock = stock === 0;

  return (
    <div className="flex flex-col gap-6 mt-2">
      {/* Stock status indicator */}
      <div className="flex items-center gap-2">
        <span
          className={`inline-block w-2 h-2 rounded-full ${isOutOfStock ? "bg-red-500" : "bg-green-500"}`}
        />
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
          {isOutOfStock ? "Out of Stock" : `${stock} in Stock`}
        </span>
      </div>

      {/* Quantity selector — Adidas minimal style */}
      {!isOutOfStock && (
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-black uppercase tracking-widest">
            Quantity
          </label>
          <div className="flex items-center border border-gray-300 w-fit">
            <button
              type="button"
              onClick={decrement}
              disabled={quantity <= 1}
              className="flex h-11 w-11 items-center justify-center hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="flex h-11 w-12 items-center justify-center text-sm font-bold text-black border-x border-gray-300 select-none">
              {quantity}
            </span>
            <button
              type="button"
              onClick={increment}
              disabled={quantity >= stock}
              className="flex h-11 w-11 items-center justify-center hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* CTA buttons — full width Adidas style */}
      <div className="flex gap-3 items-stretch">
        <Button
          className="flex-1 h-14 rounded-none text-sm font-bold uppercase tracking-[0.15em] bg-black text-white hover:bg-black/85 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          disabled={isOutOfStock || isPending}
          onClick={handleAddToCart}
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Adding...
            </span>
          ) : (
            <span className="flex items-center gap-3">
              <ShoppingBag className="h-4 w-4" />
              {isOutOfStock ? "Out of Stock" : "Add to Cart"}
            </span>
          )}
        </Button>

        <WishlistButton
          productId={productId}
          isWishlist={isWishlist}
          className="w-14 h-14 rounded-none border border-black bg-transparent hover:bg-gray-50 text-black flex-shrink-0"
        />
      </div>

      {/* Thin separator */}
      <div className="h-px w-full bg-gray-100" />
    </div>
  );
}
