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
import {
  getSelectedCartProductAction,
  removeItem,
  updateCartItemQuantity,
} from "../actions/action";
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

  const handleSelectedItemClick = async () => {
    if (isSelected) {
      isSelected = false;
      setSelectedItems((prev) => prev.filter((id) => id !== item.product.id));
    } else {
      isSelected = true;
      setSelectedItems((prev) => [...prev, item.product.id]);
    }

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
    }
  };

  useEffect(() => {
    const fetchSelectedCartProduct = async () => {
      const selectedCartProduct = await getSelectedCartProductAction();
      setSelectedItems(selectedCartProduct.map((item) => item.product.id));
    };
    fetchSelectedCartProduct();
  }, []);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: 0,
        backgroundColor: isSelected ? "#F3F4F6" : "#ffffff",
        borderColor: "#000000",
        scale: isSelected ? 1.0 : 1,
        boxShadow: isSelected
          ? "8px 8px 0px 0px #000000"
          : "4px 4px 0px 0px #000000",
      }}
      exit={{
        opacity: 0,
        x: -100,
        height: 0,
        marginBottom: 0,
        overflow: "hidden",
      }}
      whileHover={{
        scale: 1.01,
        boxShadow: "8px 8px 0px 0px #000000",
        translateY: -2,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(
        `group relative flex flex-col sm:flex-row items-start sm:items-center gap-6 border-4 p-6 cursor-pointer mb-6`,
        isSelected
          ? "z-10 bg-gray-50 border-black"
          : "z-0 bg-white border-black"
      )}
      onClick={handleSelectedItemClick}
    >
      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: -45 }}
            className="absolute -top-3 -right-3 p-2 bg-green-400 text-black border-4 border-black z-20 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            <Check className="w-5 h-5 stroke-[4px]" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative aspect-square w-full sm:w-32 shrink-0 border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
        <Image
          src={item.product.images[0]?.src}
          alt={item.product.name}
          fill
          unoptimized
          className="object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 w-full">
        <div className="flex justify-between items-start w-full gap-4">
          <h3
            className={cn(
              "font-black text-xl sm:text-2xl uppercase tracking-tight leading-none transition-colors",
              isSelected ? "text-purple-600" : "text-black"
            )}
          >
            {item.product.name}
          </h3>
          <button
            type="button"
            onClick={handleDelete}
            className="sm:hidden text-muted-foreground hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-6 h-6" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500 border border-black" />
          <p className="text-xs font-bold uppercase text-muted-foreground">
            In Stock
          </p>
        </div>

        <p className="text-2xl font-black tabular-nums tracking-tight">
          {formatRupiah(item.product.price)}
        </p>

        <div className="mt-2 flex items-center justify-between sm:justify-start gap-8">
          <div
            className="flex items-center bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              disabled={currentItem.quantity <= 1}
              className="w-10 h-10 p-0 rounded-none bg-transparent hover:bg-yellow-200 text-black border-r-4 border-black disabled:opacity-50 transition-colors"
              onClick={handleDecrementQuantity}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="w-12 text-center font-bold text-lg tabular-nums">
              {currentItem.quantity}
            </span>
            <Button
              className="w-10 h-10 p-0 rounded-none bg-transparent hover:bg-yellow-200 text-black border-l-4 border-black transition-colors"
              onClick={handleIncrementQuantity}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <button
            type="button"
            onClick={handleDelete}
            className="hidden sm:flex items-center gap-2 px-4 py-2 hover:bg-red-100 text-muted-foreground hover:text-red-600 font-bold uppercase text-sm border-2 border-transparent hover:border-red-600 transition-all cursor-pointer"
            title="Remove item"
          >
            <Trash2 className="w-5 h-5" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
