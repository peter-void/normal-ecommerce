"use client";

import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/lib/format";
import { LockKeyhole } from "lucide-react";

interface CheckoutSummaryProps {
  subtotal: number;
  shippingCost?: number;
  platformFee?: number;
}

export function CheckoutSummary({
  subtotal = 100000, // Mock default
  shippingCost = 14000,
  platformFee = 1000,
}: CheckoutSummaryProps) {
  const total = subtotal + shippingCost + platformFee;

  return (
    <div className="h-fit space-y-6 sticky top-24">
      <div className="border-2 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="text-xl font-heading mb-6 uppercase tracking-tight flex items-center gap-2">
          Summary
        </h2>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Price (Items)</span>
            <span className="font-bold">{formatRupiah(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Delivery Fee</span>
            <span className="font-bold">{formatRupiah(shippingCost)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Platform Fee</span>
            <span className="font-bold">{formatRupiah(platformFee)}</span>
          </div>

          <div className="my-4 border-t-2 border-dashed border-gray-200" />

          <div className="flex justify-between text-lg items-end">
            <span className="font-heading uppercase text-xl">Total Bill</span>
            <span className="font-heading text-xl text-primary">
              {formatRupiah(total)}
            </span>
          </div>
        </div>

        <div className="mt-8 space-y-3">
          <Button className="w-full h-12 bg-black text-white text-base font-bold uppercase tracking-wider border-2 border-transparent hover:bg-gray-900 shadow-none hover:shadow-lg transition-all flex items-center gap-2">
            <LockKeyhole className="w-4 h-4" />
            Pay Now
          </Button>

          <p className="text-[10px] text-center text-gray-400 font-medium leading-tight px-4">
            By proceeding, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
