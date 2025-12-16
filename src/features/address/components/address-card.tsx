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
        "relative overflow-hidden border-2 transition-all duration-300 group",
        "border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 p-0",
        address.mainAddress ? "bg-emerald-50" : "bg-white"
      )}
    >
      <CardContent className="p-0">
        {/* Header Bar */}
        <div
          className={cn(
            "px-6 py-2 border-b-2 border-black flex items-center justify-between",
            address.mainAddress ? "bg-emerald-200" : "bg-gray-100"
          )}
        >
          <div className="flex items-center gap-3">
            <span className="font-black uppercase tracking-tight text-lg">
              {address.label}
            </span>
            {address.mainAddress && (
              <Badge className="bg-black text-white hover:bg-black/90 border-0 rounded-none text-xs px-2 py-0.5 font-bold uppercase tracking-wider">
                Main Address
              </Badge>
            )}
          </div>
          {address.mainAddress && <CheckIcon className="w-5 h-5 text-black" />}
        </div>

        <div className="p-6 grid md:grid-cols-[1fr_200px] gap-6">
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="font-bold text-xl md:text-2xl uppercase tracking-tight">
                {address.receiverName}
              </div>
              <div className="text-gray-600 font-mono text-sm tracking-tight">
                {address.phoneNumber}
              </div>
            </div>

            <div className="bg-white border-2 border-black p-3 shadow-sm max-w-xl">
              <p className="text-gray-900 font-medium leading-relaxed">
                <span className="font-medium line-clamp-6">
                  {address.completeAddress}
                </span>{" "}
                <br />
                <span className="text-gray-500 text-sm uppercase font-bold mt-1 block">
                  {address.subdistrict}, {address.city} {address.postalCode}
                </span>
              </p>
            </div>

            <div
              className={cn(
                "flex items-center gap-2 font-bold text-sm border-2 border-black w-fit px-3 py-1 rounded-full",
                address.mainAddress
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-gray-100 text-gray-500"
              )}
            >
              <MapPinIcon className="w-4 h-4" />
              {address.mainAddress ? "PINPOINTED" : "NO PINPOINT"}
            </div>
          </div>

          <div className="flex flex-col gap-3 justify-center md:border-l-2 md:border-black md:pl-6 md:border-dashed">
            <AddressDialogButton
              buttonText={
                <>
                  <PencilIcon className="w-4 h-4 mr-2" />
                  Edit
                </>
              }
              dlgTitle="Edit Address"
              dlgDescription="Edit your address to make it easier for you to order."
              className="bg-white flex items-center justify-start"
              children={<AddNewAddressForm address={address} />}
            />

            {!address.mainAddress && (
              <>
                <Button
                  variant="neutral"
                  className="w-full justify-start border-2 border-black bg-white text-black hover:bg-emerald-200 font-bold shadow-sm"
                  onClick={handleSetMainAddress}
                  disabled={isPending || isDeleting}
                >
                  {isPending ? (
                    <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <StarIcon className="w-4 h-4 mr-2" />
                  )}
                  Set Main
                </Button>
                <Button
                  variant="neutral"
                  className="w-full justify-start border-2 border-black bg-white text-black hover:bg-red-200 hover:text-red-900 font-bold shadow-sm"
                  onClick={handleDeleteAddress}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Trash2Icon className="w-4 h-4 mr-2" />
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
