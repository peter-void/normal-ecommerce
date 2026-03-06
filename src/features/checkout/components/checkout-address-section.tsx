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
import { AddNewAddressForm } from "@/features/address/components/add-new-address-form";
import { MapPin, Plus } from "lucide-react";
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
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    if (addresses.length > 0) {
      const findMainAddress = addresses.find((address) => address.mainAddress);
      setAddress(findMainAddress || addresses[0]);
    }
  }, [addresses]);

  const handleSelectAddress = (selectedAddress: Address) => {
    setAddress(selectedAddress);
    setMainAddress(selectedAddress.id);
  };

  // ── No address state ──────────────────────────────────────────
  if (!address) {
    return (
      <div className="w-full space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-heading uppercase tracking-tight">
            Delivery Address
          </h2>
        </div>

        {/* Banner */}
        <div className="border-2 border-dashed border-gray-300 bg-gray-50 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
            <div>
              <p className="font-bold text-sm uppercase tracking-wide text-gray-800">
                No delivery address
              </p>
              <p className="text-sm text-gray-500 mt-0.5">
                You need to add a delivery address before you can checkout.
              </p>
            </div>
          </div>
          <Button
            type="button"
            onClick={() => setShowAddForm((prev) => !prev)}
            className="shrink-0 h-10 bg-black hover:bg-gray-800 text-white rounded-none font-bold uppercase tracking-widest text-xs px-5 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {showAddForm ? "Cancel" : "Add Address"}
          </Button>
        </div>

        {/* Inline form */}
        {showAddForm && (
          <div className="border-2 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-base font-heading uppercase tracking-tight mb-4 border-b-2 border-black pb-2">
              New Delivery Address
            </h3>
            <AddNewAddressForm />
          </div>
        )}
      </div>
    );
  }

  // ── Has address state ─────────────────────────────────────────
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

      <div className="relative border border-gray-200 bg-white p-0 rounded-none">
        <div className="border-b border-gray-200 bg-gray-50 px-5 py-3 flex items-center gap-2">
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
