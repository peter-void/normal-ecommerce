"use client";

import { CartItemType } from "@/types";
import { formatRupiah } from "@/lib/format";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck } from "lucide-react";

interface CheckoutCartItemProps {
  item: CartItemType;
}

export function CheckoutCartItem({ item }: CheckoutCartItemProps) {
  return (
    <div className="flex gap-5 py-6 border-b-2 last:border-0 border-dashed border-gray-200 group">
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border-2 border-border bg-gray-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)] transition-all group-hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
        <Image
          src={item.product?.images?.[0]?.src || "/placeholder.png"}
          alt={item.product?.name || "Product Image"}
          fill
          unoptimized
          className="object-cover p-2"
        />
      </div>

      <div className="flex flex-1 flex-col py-1">
        <div className="flex justify-between items-start gap-4 h-full">
          <div className="space-y-2">
            <div className="space-y-1">
              <h3 className="font-heading text-xl leading-tight uppercase tracking-tight text-gray-900">
                {item.product?.name}
              </h3>
              <div className="flex items-center gap-2">
                <Badge className="rounded-md px-2 py-0.5 text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200">
                  Variant: Natural
                </Badge>
              </div>
            </div>
          </div>

          <div className="text-right flex flex-col items-end justify-between h-full">
            <span className="text-lg font-bold tracking-tight">
              {formatRupiah(item.product?.price || 0)}
            </span>
            <span className="text-sm font-medium text-muted-foreground bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
              Qty: {item.quantity}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
