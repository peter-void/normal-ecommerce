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
    <div className="flex gap-4 py-4 border-b last:border-0 border-dashed border-gray-200">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-100">
        <Image
          src={item.product?.images?.[0]?.src || "/placeholder.png"}
          alt={item.product?.name || "Product Image"}
          fill
          unoptimized
          className="object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col justify-between">
        <div className="flex justify-between items-start gap-2">
          <div>
            <h3 className="font-bold text-sm text-gray-900 line-clamp-2">
              {item.product?.name}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Variant: Natural
            </p>
          </div>
          <span className="font-heading text-sm whitespace-nowrap">
            {item.quantity} x {formatRupiah(item.product?.price || 0)}
          </span>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-0 text-[10px] font-bold px-1.5 py-0 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            Protected
          </Badge>
        </div>
      </div>
    </div>
  );
}
