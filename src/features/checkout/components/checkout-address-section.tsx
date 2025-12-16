"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Address } from "@/generated/prisma/client";
import { MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { CheckoutAddressList } from "./checkout-address-list";
import { setMainAddress } from "@/features/address/actions/action";

interface CheckoutAddressSectionProps {
  addresses: Address[];
}

export function CheckoutAddressSection({
  addresses,
}: CheckoutAddressSectionProps) {
  const [address, setAddress] = useState<Address>();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (addresses.length > 0) {
      const findMainAddress = addresses.find((address) => address.mainAddress);
      setAddress(findMainAddress || addresses[0]);
    }
  }, [addresses]);

  if (!address) {
    return null;
  }

  const handleSelectAddress = (selectedAddress: Address) => {
    setAddress(selectedAddress);
    setMainAddress(selectedAddress.id);
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-heading uppercase tracking-tight">
          Delivery Address
        </h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="text-sm font-bold h-auto text-primary">
              Change Address
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-center text-2xl font-heading uppercase">
                Select Address
              </DialogTitle>
            </DialogHeader>
            <CheckoutAddressList
              addresses={addresses}
              selectedAddressId={address.id}
              onSelect={handleSelectAddress}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative overflow-hidden border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-0">
        <div className="border-b-2 border-black bg-gray-50 px-5 py-3 flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          <span className="font-bold text-sm uppercase tracking-wider">
            {address.label} • {address.receiverName}
          </span>
          {address.mainAddress && (
            <Badge className="ml-auto bg-emerald-500 hover:bg-emerald-600 border-0 text-white rounded-none text-[10px] uppercase font-bold px-1.5">
              Main
            </Badge>
          )}
        </div>
        <div className="p-5">
          <p
            className="text-base font-medium leading-relaxed text-gray-800 line-clamp-2"
            title={address.completeAddress}
          >
            {address.completeAddress}
          </p>
          <p className="text-sm text-gray-500 font-bold uppercase mt-1">
            {address.subdistrict}, {address.city}, {address.province},{" "}
            {address.postalCode}
          </p>
          <p className="text-sm text-gray-500 mt-2 font-mono">
            {address.phoneNumber}
          </p>
        </div>
      </div>
    </div>
  );
}
