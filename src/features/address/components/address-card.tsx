"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Address } from "@/generated/prisma/client";
import { cn } from "@/lib/utils";
import {
  CheckIcon,
  Loader2Icon,
  MapPinIcon,
  PencilIcon,
  StarIcon,
  Trash2Icon,
} from "lucide-react";
import { useTransition } from "react";
import { deleteAddress, setMainAddress } from "../actions/action";
import { AddNewAddressForm } from "./add-new-address-form";
import { AddressDialogButton } from "./address-dialog-button";

interface AddressCardProps {
  address: Address;
}

export function AddressCard({ address }: AddressCardProps) {
  const [isPending, startTransition] = useTransition();
  const [isDeleting, startDeleteTransition] = useTransition();

  const handleSetMainAddress = () => {
    startTransition(() => {
      setMainAddress(address.id);
    });
  };

  const handleDeleteAddress = () => {
    startDeleteTransition(() => {
      deleteAddress(address.id);
    });
  };

  return (
    <Card
      className={cn(
        "relative overflow-hidden border transition-all duration-300 group rounded-none",
        address.mainAddress
          ? "border-black bg-gray-50"
          : "border-gray-200 bg-white",
      )}
    >
      <CardContent className="p-0">
        {/* Header Bar */}
        <div
          className={cn(
            "px-6 py-4 flex items-center justify-between border-b",
            address.mainAddress ? "border-gray-200" : "border-gray-100",
          )}
        >
          <div className="flex items-center gap-3">
            <span className="font-bold uppercase tracking-widest text-sm text-black">
              {address.label}
            </span>
            {address.mainAddress && (
              <Badge className="bg-black text-white hover:bg-black/90 border-0 rounded-none text-[10px] px-2 py-0.5 font-bold uppercase tracking-widest">
                Main Address
              </Badge>
            )}
          </div>
          {address.mainAddress && <CheckIcon className="w-5 h-5 text-black" />}
        </div>

        <div className="p-6 grid md:grid-cols-[1fr_220px] gap-8">
          <div className="space-y-6">
            <div className="space-y-1">
              <div className="font-black text-xl md:text-2xl uppercase tracking-tighter text-black">
                {address.receiverName}
              </div>
              <div className="inline-block text-gray-500 font-medium text-sm tracking-widest uppercase">
                {address.phoneNumber}
              </div>
            </div>

            <div className="bg-white border border-gray-200 p-5 max-w-xl">
              <p className="text-black font-medium leading-relaxed">
                <span className="text-base block mb-3">
                  {address.completeAddress}
                </span>{" "}
                <span className="text-gray-500 text-xs uppercase font-bold mt-3 pt-3 border-t border-gray-100 block tracking-widest">
                  {address.subdistrict}, {address.city} {address.postalCode}
                </span>
              </p>
            </div>

            <div
              className={cn(
                "flex items-center gap-2 font-bold text-[10px] border w-fit px-3 py-1.5 rounded-none uppercase tracking-widest",
                address.mainAddress
                  ? "border-black bg-black text-white"
                  : "border-gray-200 bg-white text-gray-400",
              )}
            >
              <MapPinIcon className="w-3.5 h-3.5" />
              {address.mainAddress ? "PINPOINTED" : "NO PINPOINT"}
            </div>
          </div>

          <div className="flex flex-col gap-3 justify-center md:border-l md:border-gray-200 md:pl-8">
            <AddressDialogButton
              buttonText={
                <>
                  <PencilIcon className="w-3.5 h-3.5 mr-2" />
                  Edit Address
                </>
              }
              dlgTitle="Edit Address"
              dlgDescription="Update your address details."
              className="w-full text-xs font-bold bg-white hover:bg-gray-50 text-black border border-gray-200 hover:border-black transition-all uppercase tracking-widest py-5 rounded-none"
              children={<AddNewAddressForm address={address} />}
            />

            {!address.mainAddress && (
              <>
                <Button
                  className="w-full justify-start text-xs font-bold border border-gray-200 bg-white text-black hover:border-black hover:bg-gray-50 transition-all uppercase tracking-widest py-5 rounded-none"
                  onClick={handleSetMainAddress}
                  disabled={isPending || isDeleting}
                >
                  {isPending ? (
                    <Loader2Icon className="w-3.5 h-3.5 mr-2 animate-spin" />
                  ) : (
                    <StarIcon className="w-3.5 h-3.5 mr-2" />
                  )}
                  Set Main
                </Button>
                <Button
                  className="w-full justify-start text-xs font-bold border border-red-200 bg-white text-red-500 hover:border-red-500 hover:bg-red-50 transition-all uppercase tracking-widest py-5 rounded-none"
                  onClick={handleDeleteAddress}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <Loader2Icon className="w-3.5 h-3.5 mr-2 animate-spin" />
                  ) : (
                    <Trash2Icon className="w-3.5 h-3.5 mr-2" />
                  )}
                  Delete
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
