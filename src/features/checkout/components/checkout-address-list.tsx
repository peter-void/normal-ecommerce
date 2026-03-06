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
              "relative border transition-colors duration-200 group rounded-none",
              isSelected
                ? "border-black bg-gray-50"
                : "border-gray-200 bg-white hover:border-black",
            )}
          >
            <div
              className={cn(
                "px-5 py-4 border-b border-gray-200 flex items-center justify-between",
              )}
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "font-bold uppercase tracking-widest text-sm text-black",
                  )}
                >
                  {addr.label}
                </span>
                {addr.mainAddress && (
                  <Badge className="bg-black text-white hover:bg-black/90 border-0 rounded-none text-[10px] px-2 py-0.5 font-bold uppercase tracking-widest">
                    Main
                  </Badge>
                )}
              </div>
              {isSelected && <CheckCircle2 className="w-5 h-5 text-black" />}
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
                  <div className="mt-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-black">
                    <MapPin className="w-4 h-4" />
                    Selected for Delivery
                  </div>
                )}
              </div>

              <div className="flex items-center">
                {isSelected ? (
                  <Button
                    disabled
                    className="w-full md:w-auto bg-black text-white hover:bg-gray-800 rounded-none border-none font-bold uppercase tracking-widest text-xs h-11 px-8"
                  >
                    Selected
                  </Button>
                ) : (
                  <Button
                    onClick={() => onSelect?.(addr)}
                    className="w-full md:w-auto bg-white text-black hover:bg-gray-50 border border-gray-200 hover:border-black rounded-none transition-colors font-bold uppercase tracking-widest text-xs h-11 px-8"
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
