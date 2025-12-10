"use client";

import { Button } from "@/components/ui/button";
import { useCartItem } from "@/hooks/use-cart-item";
import { formatRupiah } from "@/lib/format";
import { cn } from "@/lib/utils";
import { CartItemType } from "@/types";
import { Minus, Plus, Trash2, Check } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { removeItem, updateCartItemQuantity } from "../actions/action";
import { useRouter } from "next/navigation";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const router = useRouter();

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
    router.refresh();
  };

  useEffect(() => {
    setCartItems((prev) => {
      const exists = prev.some((i) => i.id === currentItem.id);
      if (exists) return prev;
      return [...prev, currentItem];
    });
  }, []);

  const isSelected = selectedItems.includes(item.id);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: 0,
        borderColor: isSelected ? "var(--primary)" : "var(--border)",
        backgroundColor: "#ffffff",
        scale: isSelected ? 1.02 : 1,
        boxShadow: isSelected ? "6px 6px 0px 0px var(--border)" : "normal",
      }}
      whileHover={{
        scale: isSelected ? 1.02 : 1.01,
        translateY: -2,
        boxShadow: "6px 6px 0px 0px var(--border)",
      }}
      whileTap={{
        scale: 0.98,
        boxShadow: "2px 2px 0px 0px var(--border)",
        translateY: 0,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(
        `group relative flex flex-col sm:flex-row items-start sm:items-center gap-4 border-2 p-4 shadow-shadow cursor-pointer overflow-hidden`,
        isSelected ? "z-10" : "z-0"
      )}
      onClick={() => {
        if (isSelected) {
          setSelectedItems((prev) => prev.filter((id) => id !== item.id));
        } else {
          setSelectedItems((prev) => [...prev, item.id]);
        }
      }}
    >
      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: -45 }}
            className="absolute top-0 right-0 p-1 bg-primary text-primary-foreground rounded-bl-lg border-l-2 border-b-2 border-border"
          >
            <Check className="w-4 h-4" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative aspect-square w-full sm:w-24 shrink-0 overflow-hidden border-2 border-border bg-muted">
        <Image
          src={item.product.images[0]?.src}
          alt={item.product.name}
          fill
          unoptimized
          className="object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col gap-2 w-full">
        <div className="flex justify-between items-start w-full gap-2">
          <h3
            className={cn(
              "font-heading text-lg sm:text-xl line-clamp-2 transition-colors",
              isSelected && "text-primary"
            )}
          >
            {item.product.name}
          </h3>
          <button
            type="button"
            onClick={handleDelete}
            className="text-muted-foreground hover:text-red-500 transition-colors sm:hidden"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>

        <p className="text-lg font-bold">{formatRupiah(item.product.price)}</p>

        <div className="mt-2 flex items-center justify-between sm:justify-start gap-6">
          <div
            className="flex items-center gap-4 bg-background border-2 border-border p-1 shadow-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              disabled={currentItem.quantity <= 1}
              className="p-1 hover:bg-muted disabled:opacity-50 transition-colors size-8 bg-transparent text-foreground hover:text-foreground border-none shadow-none"
              onClick={handleDecrementQuantity}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="w-4 text-center font-bold tabular-nums">
              {currentItem.quantity}
            </span>
            <Button
              className="p-1 hover:bg-muted transition-colors size-8 bg-transparent text-foreground hover:text-foreground border-none shadow-none"
              onClick={handleIncrementQuantity}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <button
            type="button"
            onClick={handleDelete}
            className="hidden sm:block p-2 hover:bg-red-100 text-muted-foreground hover:text-red-500 border-2 border-transparent hover:border-border transition-all"
            title="Remove item"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
