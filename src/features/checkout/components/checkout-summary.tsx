"use client";

import { Button } from "@/components/ui/button";
import { useCheckout } from "@/hooks/use-checkout";
import { formatRupiah } from "@/lib/format";
import { CartItemType } from "@/types";
import { Loader2, LockKeyhole } from "lucide-react";
import { useEffect, useTransition } from "react";

declare global {
  interface Window {
    snap: {
      pay: (token: string) => void;
    };
  }
}

interface CheckoutSummaryProps {
  items: CartItemType[];
}

export function CheckoutSummary({ items }: CheckoutSummaryProps) {
  const [isPending, startTransition] = useTransition();
  const { selectedServiceContext: selectedService, setTotalBill } =
    useCheckout();

  const totalPrice = items.reduce(
    (acc, item) => acc + item.quantity * Number(item.product.price),
    0
  );

  const deliveryFee = selectedService?.cost || 0;

  const platformFee = 2000;

  const totalBill = totalPrice + deliveryFee + platformFee;

  useEffect(() => {
    setTotalBill(totalBill);
  }, [totalBill]);

  const handlePayNow = () => {
    startTransition(async () => {
      const response = await fetch("/api/payment", {
        method: "POST",
        body: JSON.stringify({
          totalAmount: totalPrice,
          productDetails: items.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
            price: item.product.price,
            name: item.product.name,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create payment");
      }

      const data = await response.json();

      if (window.snap) {
        window.snap.pay(data.token);
      } else {
        window.location.href = data.url;
      }
    });
  };

  return (
    <div className="h-fit space-y-6 sticky top-24">
      <div className="border-2 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="text-xl font-heading mb-6 uppercase tracking-tight flex items-center gap-2">
          Summary
        </h2>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Price (Items)</span>
            <span className="font-bold">{formatRupiah(totalPrice)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Delivery Fee</span>
            <span className="font-bold">{formatRupiah(deliveryFee)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Platform Fee</span>
            <span className="font-bold">{formatRupiah(platformFee)}</span>
          </div>

          <div className="my-4 border-t-2 border-dashed border-gray-200" />

          <div className="flex justify-between text-lg items-end">
            <span className="font-heading uppercase text-xl">Total Bill</span>
            <span className="font-heading text-xl text-primary">
              {formatRupiah(totalBill)}
            </span>
          </div>
        </div>

        <div className="mt-8 space-y-3">
          <Button
            className="w-full h-12 bg-black text-white text-base font-bold uppercase tracking-wider border-2 border-transparent hover:bg-gray-900 shadow-none hover:shadow-lg transition-all flex items-center gap-2"
            onClick={handlePayNow}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <LockKeyhole className="w-4 h-4" />
            )}
            Pay Now
          </Button>
        </div>
      </div>
    </div>
  );
}
