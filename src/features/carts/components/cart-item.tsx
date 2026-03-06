"use client";

import { Button } from "@/components/ui/button";
import { useCartItem } from "@/hooks/use-cart-item";
import { formatRupiah } from "@/lib/format";
import { cn } from "@/lib/utils";
import { CartItemType } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { removeItem, updateCartItemQuantity } from "../actions/action";
import { toast } from "sonner";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const {
    setCartItems,
    incrementQuantity,
    decrementQuantity,
    selectedItems,
    setSelectedItems,
    removeCartItem,
  } = useCartItem();
  const [currentItem, setCurrentItem] = useState(item);
  const timer = useRef<NodeJS.Timeout>(undefined);
  const selectTimer = useRef<NodeJS.Timeout>(undefined);
  const pendingSelected = useRef<boolean | null>(null);

  const triggerUpdate = (qty: number) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      try {
        await updateCartItemQuantity(currentItem.id, qty);
      } catch (error) {
        console.error(error);
      }
    }, 500);
  };

  const handleIncrementQuantity = (e: React.MouseEvent) => {
    e.stopPropagation();
    incrementQuantity(currentItem.id);

    const newQty = currentItem.quantity + 1;

    setCurrentItem((prev) => ({
      ...prev,
      quantity: newQty,
    }));

    triggerUpdate(newQty);
  };

  const handleDecrementQuantity = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentItem.quantity <= 1) return;

    const newQty = currentItem.quantity - 1;

    decrementQuantity(currentItem.id);
    setCurrentItem((prev) => ({
      ...prev,
      quantity: newQty,
    }));

    triggerUpdate(newQty);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    removeCartItem(currentItem.id);
    removeItem(currentItem.id);
  };

  useEffect(() => {
    setCartItems((prev) => {
      const exists = prev.some((i) => i.id === currentItem.id);
      if (exists) return prev;
      return [...prev, currentItem];
    });
  }, []);

  let isSelected = selectedItems.includes(item.product.id);

  const handleSelectedItemClick = () => {
    // Optimistically toggle UI immediately
    if (isSelected) {
      setSelectedItems((prev) => prev.filter((id) => id !== item.product.id));
    } else {
      setSelectedItems((prev) => [...prev, item.product.id]);
    }

    // Track the latest desired state (debounce rapid clicks)
    pendingSelected.current = !isSelected;

    if (selectTimer.current) clearTimeout(selectTimer.current);
    selectTimer.current = setTimeout(async () => {
      try {
        const response = await fetch("/api/products/selected-item", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId: item.product.id,
            cartId: item.cartId,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to update selected items");
        }
      } catch (error) {
        toast.error("Failed to update selected items");
        // Revert optimistic update on error
        setSelectedItems((prev) =>
          pendingSelected.current
            ? prev.filter((id) => id !== item.product.id)
            : [...prev, item.product.id],
        );
      } finally {
        pendingSelected.current = null;
      }
    }, 400);
  };

  return (
    <AnimatePresence>
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -60, height: 0, overflow: "hidden" }}
        transition={{ duration: 0.2 }}
        className={`group relative flex flex-col sm:flex-row items-stretch border-t border-b sm:border-b-0 border-gray-300 py-6 mb-0 transition-colors cursor-pointer ${
          isSelected ? "bg-gray-50" : "bg-white hover:bg-gray-50"
        }`}
        onClick={handleSelectedItemClick}
      >
        {/* Selected Indicator - Black line on the left like Adidas or just rely on background */}
        {isSelected && (
          <div className="absolute top-0 left-0 w-1 h-full bg-black" />
        )}

        {/* Product image - thin border around image like Adidas */}
        <div
          className={`relative aspect-square w-32 sm:w-48 shrink-0 border border-gray-200 bg-gray-100 overflow-hidden ml-4 sm:ml-6`}
        >
          <Image
            src={item.product.images[0]?.src}
            alt={item.product.name}
            fill
            unoptimized
            className="object-cover"
          />
        </div>

        {/* Info Area */}
        <div className="flex flex-1 flex-col justify-between ml-4 sm:ml-6 mr-2 sm:mr-6 py-1 min-w-0">
          <div className="flex justify-between items-start gap-4">
            <div className="space-y-1.5 flex-1 pr-4">
              <h3 className="font-normal text-[15px] text-black">
                {item.product.name}
              </h3>
              {item.product.description && (
                <p className="text-[13px] text-gray-500 line-clamp-2">
                  {item.product.description}
                </p>
              )}
              {/* Dynamic stock badge */}
              {item.product.stock === 0 ? (
                <p className="text-[13px] font-bold text-red-600 pt-1">
                  Out of stock
                </p>
              ) : item.product.stock <= 5 ? (
                <p className="text-[13px] font-bold text-[#b85a00] pt-1">
                  Low stock ({item.product.stock} left)
                </p>
              ) : null}
            </div>

            {/* Delete (Trash Icon) - top right */}
            <button
              type="button"
              onClick={handleDelete}
              className="text-gray-500 hover:text-black transition-colors shrink-0 p-1"
            >
              <Trash2 className="w-[18px] h-[18px]" />
            </button>
          </div>

          <div className="flex items-center justify-between mt-6">
            {/* Quantity stepper */}
            <div
              className="flex items-center border border-gray-300 divide-x divide-gray-300"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={handleDecrementQuantity}
                disabled={currentItem.quantity <= 1}
                className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-10 h-9 flex items-center justify-center text-[15px] font-bold text-black tabular-nums">
                {currentItem.quantity}
              </span>
              <button
                type="button"
                onClick={handleIncrementQuantity}
                disabled={currentItem.quantity >= item.product.stock}
                className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Price */}
            <p className="text-[15px] font-bold text-black tracking-tight">
              {formatRupiah(item.product.price)}
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
