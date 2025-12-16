"use client";

import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Courier } from "@/constants";
import { Address } from "@/generated/prisma/client";
import { useCartItem } from "@/hooks/use-cart-item";
import { useCheckout } from "@/hooks/use-checkout";
import { formatRupiah } from "@/lib/format";
import { cn } from "@/lib/utils";
import { CartItemType, Level } from "@/types";
import { Check, ChevronDown, Loader2, Truck } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const COURIER_METADATA: Record<Courier, { name: string; logo: string }> = {
  jne: {
    name: "Jalur Nugraha Ekakurir (JNE)",
    logo: "/jne.png",
  },
  sicepat: {
    name: "SiCepat Ekspres",
    logo: "/sicepat.png",
  },
  jnt: {
    name: "J&T Express",
    logo: "/jnt.png",
  },
  tiki: {
    name: "Citra Van Titipan Kilat (TIKI)",
    logo: "/tiki.png",
  },
};

interface CourierSelectionProps {
  items: CartItemType[];
  mainAddress: Address;
}

export function CourierSelection({
  items,
  mainAddress,
}: CourierSelectionProps) {
  const [selectedCourier, setSelectedCourier] = useState<Courier>("jne");
  const [courierServices, setCourierServices] = useState<Level[]>([]);
  const [selectedService, setSelectedService] = useState<Level | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { setCartItems } = useCartItem();
  const { setSelectedCourierContext, setSelectedServiceContext } =
    useCheckout();

  useEffect(() => {
    if (items) {
      setCartItems(items);
    }
  }, [items, setCartItems]);

  useEffect(() => {
    if (selectedCourier && items.length > 0 && mainAddress?.subdistrictId) {
      const totalWeight = items.reduce(
        (acc, item) => acc + Number(item.product.weight),
        0
      );

      const fetchCosts = async () => {
        setIsLoading(true);
        setCourierServices([]);
        setSelectedService(null);

        try {
          const response = await fetch(
            `/api/rajaongkir/calculateCost?courier=${selectedCourier}&weight=${totalWeight}&destination=${mainAddress.subdistrictId}&origin=1360`
          );

          if (!response.ok) {
            throw new Error("Failed to fetch courier data");
          }

          const data: Level[] = await response.json();
          setCourierServices(data);

          if (data && data.length > 0) {
            setSelectedService(data[0]);
            setSelectedServiceContext(data[0]);
          }
        } catch (error) {
          console.error("Error fetching courier costs:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchCosts();
    }
  }, [selectedCourier, items, mainAddress?.subdistrictId]);

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-heading uppercase tracking-tight">
          Shipping Method
        </h2>
        <Badge className="text-xs font-bold uppercase tracking-wider border-2 border-black bg-white text-black hover:bg-gray-100">
          Select Service
        </Badge>
      </div>

      <div className="flex flex-col gap-3">
        {Object.entries(COURIER_METADATA).map(([id, info]) => {
          const isSelected = selectedCourier === id;

          return (
            <DropdownMenu
              key={id}
              onOpenChange={(open) => {
                if (open && !isSelected) {
                  setSelectedCourier(id as Courier);
                  setSelectedCourierContext(id as Courier);
                }
              }}
            >
              <DropdownMenuTrigger className="w-full outline-none" asChild>
                <div
                  className={cn(
                    "relative w-full cursor-pointer border-2 p-4 transition-all duration-300 group overflow-hidden rounded-base",
                    isSelected
                      ? "border-primary bg-primary/5 shadow-[4px_4px_0px_0px_var(--primary)] -translate-y-[2px]"
                      : "border-border bg-white hover:border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-[2px]"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-20 shrink-0 relative flex items-center justify-center bg-white border-2 border-border rounded-base overflow-hidden p-2">
                      <Image
                        src={info.logo}
                        alt={info.name}
                        fill
                        className="object-contain p-1"
                        unoptimized
                      />
                    </div>

                    <div className="flex-1 text-left space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-lg leading-none line-clamp-1 mr-2">
                          {info.name}
                        </span>
                        {isSelected && selectedService ? (
                          <span className="font-heading text-lg whitespace-nowrap">
                            {formatRupiah(selectedService.cost)}
                          </span>
                        ) : (
                          <div className="flex items-center text-xs text-muted-foreground font-medium uppercase tracking-wider">
                            Select <ChevronDown className="w-3 h-3 ml-1" />
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-sm text-muted-foreground min-h-6">
                        {isSelected && selectedService ? (
                          <>
                            <div className="flex items-center gap-2">
                              <Badge className="rounded-sm px-1.5 py-0 text-xs font-bold bg-gray-200 text-gray-800 border-none">
                                {selectedService.service}
                              </Badge>
                              <span className="text-xs truncate max-w-[150px]">
                                {selectedService.description}
                              </span>
                            </div>
                            <span className="font-medium text-xs flex items-center gap-1">
                              <Truck className="w-3 h-3" />
                              {selectedService.etd
                                .replace(" day", "")
                                .replace(" HARI", "")}{" "}
                              Days
                            </span>
                          </>
                        ) : (
                          <span className="text-xs text-gray-400">
                            Click to see available services
                          </span>
                        )}
                      </div>
                    </div>

                    <div
                      className={cn(
                        "w-6 h-6 rounded-full border-2 flex shrink-0 items-center justify-center transition-colors ml-2",
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-gray-300 group-hover:border-black"
                      )}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>
                  </div>
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] max-h-[300px] overflow-y-auto bg-white"
                align="center"
              >
                {isLoading && isSelected ? (
                  <div className="flex flex-col items-center justify-center py-6 text-muted-foreground gap-2">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span className="text-xs font-medium">
                      Fetching rates...
                    </span>
                  </div>
                ) : isSelected && courierServices.length > 0 ? (
                  <div className="flex flex-col gap-1 p-1">
                    {courierServices.map((level, idx) => (
                      <DropdownMenuItem
                        key={`${level.code}-${level.service}-${idx}`}
                        onClick={() => {
                          setSelectedService(level);
                          setSelectedServiceContext(level);
                        }}
                        className={cn(
                          "cursor-pointer flex items-center justify-between py-3 px-3 rounded-md border border-transparent hover:border-border hover:bg-gray-50 focus:bg-gray-50 bg-white",
                          selectedService?.service === level.service &&
                            "bg-primary/5 border-primary/20 border-2"
                        )}
                      >
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm">
                              {level.service}
                            </span>
                            <span className="text-[10px] text-muted-foreground uppercase bg-gray-100 px-1.5 rounded-sm">
                              {level.etd
                                .replace(" day", "")
                                .replace(" HARI", "")}{" "}
                              Days
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground line-clamp-1">
                            {level.description}
                          </span>
                        </div>
                        <span className="text-sm font-bold">
                          {formatRupiah(level.cost)}
                        </span>
                      </DropdownMenuItem>
                    ))}
                  </div>
                ) : (
                  <div className="py-4 text-center text-xs text-muted-foreground">
                    No services available
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        })}
      </div>
    </div>
  );
}
