"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Address } from "@/generated/prisma/client";
import { cn } from "@/lib/utils";
import { CheckCircle2, MapPin } from "lucide-react";

interface CheckoutAddressListProps {
  addresses: Address[];
  selectedAddressId?: string;
  onSelect?: (address: Address) => void;
}

export function CheckoutAddressList({
  addresses,
  selectedAddressId,
  onSelect,
}: CheckoutAddressListProps) {
  return (
    <div className="flex flex-col gap-4 py-4">
      {addresses.map((addr) => {
        const isSelected = selectedAddressId === addr.id;

        return (
          <div
            key={addr.id}
            className={cn(
              "relative overflow-hidden border-2 transition-all duration-300 group",
              isSelected
                ? "border-emerald-500 bg-emerald-50/50 shadow-[4px_4px_0px_0px_#10b981]" // Emerald shadow for selected
                : "border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
            )}
          >
            <div
              className={cn(
                "px-5 py-3 border-b-2 flex items-center justify-between",
                isSelected
                  ? "border-emerald-500 bg-emerald-100"
                  : "border-black bg-gray-50"
              )}
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "font-bold uppercase tracking-tight",
                    isSelected ? "text-emerald-900" : "text-black"
                  )}
                >
                  {addr.label}
                </span>
                {addr.mainAddress && (
                  <Badge className="bg-gray-200 text-gray-700 hover:bg-gray-300 border-0 rounded-none text-[10px] px-2 py-0.5 font-bold uppercase tracking-wider">
                    Main
                  </Badge>
                )}
              </div>
              {isSelected && (
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              )}
            </div>

            <div className="p-5 grid gap-4 md:grid-cols-[1fr_auto]">
              <div className="space-y-2">
                <div className="font-bold text-lg uppercase tracking-tight">
                  {addr.receiverName}
                </div>
                <div className="text-sm font-mono text-gray-600">
                  {addr.phoneNumber}
                </div>

                <div className="mt-2 text-gray-800 leading-relaxed max-w-lg line-clamp-2">
                  {addr.completeAddress}
                </div>

                <div className="text-xs font-bold text-gray-500 uppercase">
                  {addr.subdistrict}, {addr.city}, {addr.province}{" "}
                  {addr.postalCode}
                </div>

                {isSelected && (
                  <div className="mt-3 flex items-center gap-2 text-sm font-bold text-emerald-700">
                    <MapPin className="w-4 h-4" />
                    Selected for Delivery
                  </div>
                )}
              </div>

              <div className="flex items-center">
                {isSelected ? (
                  <Button
                    disabled
                    className="w-full md:w-auto bg-emerald-600 text-white font-bold opacity-100 uppercase tracking-wider border-2 border-transparent"
                  >
                    Selected
                  </Button>
                ) : (
                  <Button
                    onClick={() => onSelect?.(addr)}
                    className="w-full md:w-auto bg-black text-white hover:bg-gray-800 font-bold uppercase tracking-wider border-2 border-transparent hover:border-black shadow-none transition-all"
                  >
                    Select
                  </Button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
