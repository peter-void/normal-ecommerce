"use client";

import { useCartItem } from "@/hooks/use-cart-item";
import { formatRupiah, parseDecimalPrice } from "@/lib/format";
import { useEffect, useState } from "react";

export function OrderSummary() {
  const { cartItems, selectedItems } = useCartItem();
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const total = selectedItems.reduce((acc, id) => {
      const item = cartItems.find((item) => item.id === id);
      if (!item) return acc;
      return acc + parseDecimalPrice(item.product.price) * item.quantity;
    }, 0);
    setTotal(total);
  }, [cartItems, selectedItems]);

  return (
    <div className="h-fit space-y-4">
      <div className="border-2 border-border bg-white p-5 shadow-shadow">
        <h2 className="text-xl font-heading mb-4 uppercase">Order Summary</h2>

        <div className="space-y-4 text-base">
          <div className="flex justify-between text-lg">
            <span className="font-heading uppercase">Total</span>
            <span className="font-heading">{formatRupiah(total)}</span>
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <button className="w-full bg-chart-5 text-white text-sm font-heading uppercase py-3 border-2 border-border shadow-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all active:translate-x-[4px] active:translate-y-[4px]">
            Checkout
          </button>
          <button className="w-full bg-white text-foreground text-sm font-heading uppercase py-3 border-2 border-border shadow-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all active:translate-x-[4px] active:translate-y-[4px]">
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
