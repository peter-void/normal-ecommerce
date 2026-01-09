"use client";

import { Button } from "@/components/ui/button";
import { useCartItem } from "@/hooks/use-cart-item";
import { formatRupiah, parseDecimalPrice } from "@/lib/format";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Receipt } from "lucide-react";

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

  return (
    <div className="h-fit space-y-6">
      {/* Tape Effect */}
      <div className="w-32 h-8 bg-[#FFE4E1] mx-auto -mb-4 relative z-10 rotate-1 opacity-80 backdrop-blur-sm" />

      <div className="border-4 border-black bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-[14px_14px_0px_0px_rgba(0,0,0,1)]">
        {/* Header */}
        <div className="bg-yellow-400 p-6 border-b-4 border-black">
          <div className="flex items-center gap-3">
            <Receipt className="w-6 h-6 stroke-[3px]" />
            <h2 className="text-2xl font-black uppercase tracking-tight">
              Totals
            </h2>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-3 font-mono text-sm">
            <div className="flex justify-between items-center text-muted-foreground">
              <span>Items Selected:</span>
              <span className="font-bold text-black">
                {selectedItems.length}
              </span>
            </div>
            <div className="flex justify-between items-center text-muted-foreground">
              <span>Taxes:</span>
              <span className="font-bold text-black italic">
                Calculated Later
              </span>
            </div>
          </div>

          <div
            className="h-0.5 w-full bg-black dashed"
            style={{
              backgroundImage:
                "linear-gradient(to right, black 50%, transparent 50%)",
              backgroundSize: "10px 100%",
            }}
          />

          <div className="space-y-1">
            <div className="flex justify-between items-baseline">
              <span className="font-black text-xl uppercase tracking-tighter">
                Subtotal
              </span>
            </div>
            <div className="text-4xl font-black text-transparent bg-clip-text bg-linear-to-r from-purple-600 to-pink-600 tracking-tighter leading-none py-1">
              {formatRupiah(total)}
            </div>
          </div>

          <div className="space-y-3 pt-4">
            <Button
              className="w-full h-14 bg-black text-white text-lg font-black uppercase tracking-widest border-4 border-black hover:bg-gray-900 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 group relative overflow-hidden"
              disabled={selectedItems.length === 0}
              asChild
            >
              {selectedItems.length === 0 ? (
                <span className="flex items-center justify-center gap-2">
                  Select Items
                </span>
              ) : (
                <Link
                  href="/cart/checkout"
                  className="flex items-center justify-center gap-2"
                >
                  Checkout
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
            </Button>

            <Button className="w-full bg-white text-black text-sm font-bold uppercase py-3 border-2 border-black hover:bg-gray-50 transition-colors">
              Continue Shopping
            </Button>
          </div>
        </div>

        <div className="h-4 bg-white w-full relative overflow-hidden -mb-px border-t-2 border-dashed border-gray-200">
          <div className="absolute bottom-0 left-0 w-full h-full bg-[linear-gradient(45deg,transparent_75%,black_75%),linear-gradient(-45deg,transparent_75%,black_75%)] bg-size-[16px_16px] bg-position-[0_8px]" />
        </div>
      </div>
    </div>
  );
}
