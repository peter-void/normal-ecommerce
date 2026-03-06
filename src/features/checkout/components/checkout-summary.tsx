"use client";

import { Button } from "@/components/ui/button";
import { useCheckout } from "@/hooks/use-checkout";
import { formatRupiah } from "@/lib/format";
import { CartItemType } from "@/types";
import { Loader2, LockKeyhole } from "lucide-react";
import { useEffect, useTransition } from "react";
import { toast } from "sonner";

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

  const safeItems = items ?? [];

  const totalPrice = safeItems.reduce(
    (acc, item) => acc + item.quantity * Number(item.product.price),
    0,
  );

  const deliveryFee = selectedService?.cost || 0;

  const platformFee = 2000;

  const totalBill = totalPrice + deliveryFee + platformFee;

  useEffect(() => {
    setTotalBill(totalBill);
  }, [totalBill]);

  const handlePayNow = () => {
    startTransition(async () => {
      try {
        const response = await fetch("/api/payment", {
          method: "POST",
          body: JSON.stringify({
            totalAmount: totalPrice,
            productDetails: safeItems.map((item) => ({
              productId: item.product.id,
              quantity: item.quantity,
              price: item.product.price,
              name: item.product.name,
            })),
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error);
        }

        const data = await response.json();

        if (window.snap) {
          window.snap.pay(data.token);
        } else {
          window.location.href = data.url;
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
          return;
        }

        toast.error("Failed to create payment");
      }
    });
  };

  return (
    <div className="h-fit space-y-6 sticky top-24">
      <div className="border border-gray-200 bg-white p-6">
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

          <div className="my-4 border-t border-gray-200" />

          <div className="flex justify-between text-lg items-end">
            <span className="font-heading uppercase text-xl">Total Bill</span>
            <span className="font-heading text-xl text-primary">
              {formatRupiah(totalBill)}
            </span>
          </div>
        </div>

        <div className="mt-8 space-y-3">
          <Button
            className="w-full h-12 bg-black text-white text-base font-bold uppercase tracking-widest border-0 rounded-none hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
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
