"use client";

import { useCartItem } from "@/hooks/use-cart-item";
import { formatRupiah, parseDecimalPrice } from "@/lib/format";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function OrderSummary() {
  const { cartItems, selectedItems } = useCartItem();
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const total = selectedItems.reduce((acc, id) => {
      const item = cartItems.find((item) => item.product.id === id);
      if (!item) return acc;
      return acc + parseDecimalPrice(item.product.price) * item.quantity;
    }, 0);
    setTotal(total);
  }, [cartItems, selectedItems]);

  const selectedCount = selectedItems.length;

  return (
    <div className="bg-white pb-8">
      {/* Header — matches Adidas large bold title */}
      <h2 className="text-2xl md:text-[28px] font-black uppercase tracking-widest mb-6">
        Order Summary
      </h2>

      {/* Line items — same size as Adidas (small, grey labels) */}
      <div className="space-y-3 text-[15px] mb-6">
        <div className="flex justify-between">
          <span className="text-gray-600">{selectedCount} item</span>
          <span className="text-black">{formatRupiah(total)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span className="text-black">Free</span>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 my-6" />

      {/* Total — bold, not uppercase, same as Adidas */}
      <div className="flex justify-between items-baseline mb-8">
        <span className="font-bold text-base">Total</span>
        <span className="font-bold text-base">{formatRupiah(total)}</span>
      </div>

      {/* Checkout Button — full width black, arrow on right */}
      <div className="mb-8">
        {total === 0 ? (
          <button
            disabled
            className="w-full h-[50px] bg-gray-200 text-gray-400 rounded-none font-bold text-[15px] tracking-wide flex items-center justify-between px-5 cursor-not-allowed"
          >
            <span>Select items to checkout</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        ) : (
          <Link
            href="/cart/checkout"
            className="w-full h-[50px] bg-black text-white font-bold text-[15px] tracking-wide hover:bg-gray-800 transition-colors flex items-center justify-between px-5 group"
          >
            <span>Checkout</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        )}
      </div>
    </div>
  );
}
