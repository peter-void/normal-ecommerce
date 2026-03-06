import { getAddresses } from "@/dal/getAddresses";
import { AddNewAddressForm } from "@/features/address/components/add-new-address-form";
import { AddressCard } from "@/features/address/components/address-card";
import { AddressDialogButton } from "@/features/address/components/address-dialog-button";
import { MapPinIcon, PlusIcon } from "lucide-react";

export default async function Page() {
  const addresses = await getAddresses();

  return (
    <div className="space-y-8 pb-10">
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight">
            My Address
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Your address list. you can only save up to 2 addresses.
          </p>
        </div>
        <AddressDialogButton
          buttonText={
            <>
              <PlusIcon className="w-5 h-5 mr-2" />
              Add New Address
            </>
          }
          dlgTitle=""
          dlgDescription=""
          className="h-11 px-8 bg-black hover:bg-gray-800 text-white border-0 rounded-none font-bold uppercase tracking-widest text-xs transition-colors"
          children={<AddNewAddressForm />}
        />
      </div>

      <div className="space-y-4">
        {addresses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border border-dashed border-gray-300 bg-gray-50">
            <div className="w-16 h-16 bg-black flex items-center justify-center mb-6">
              <MapPinIcon className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-black uppercase tracking-tight text-black mb-2">
              No Address Yet
            </h2>
            <p className="text-gray-500 text-sm text-center max-w-xs mb-8">
              You haven&apos;t added any shipping address. Add one now to make
              checkout faster.
            </p>
            <AddressDialogButton
              buttonText={
                <>
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Add Your First Address
                </>
              }
              dlgTitle=""
              dlgDescription=""
              className="h-11 px-8 bg-black hover:bg-gray-800 text-white border-0 rounded-none font-bold uppercase tracking-widest text-xs transition-colors"
              children={<AddNewAddressForm />}
            />
          </div>
        ) : (
          addresses.map((address) => (
            <AddressCard key={address.id} address={address} />
          ))
        )}
      </div>
    </div>
  );
}
