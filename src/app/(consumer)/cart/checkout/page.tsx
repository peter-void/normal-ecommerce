import { getAddresses } from "@/dal/getAddresses";
import { fetchCartItems } from "@/features/carts/actions/action";
import { CheckoutAddressSection } from "@/features/checkout/components/checkout-address-section";
import { CheckoutCartItem } from "@/features/checkout/components/checkout-cart-item";
import { CheckoutSummary } from "@/features/checkout/components/checkout-summary";
import { CourierSelection } from "@/features/checkout/components/courier-selection";

export default async function Page() {
  const { items } = await fetchCartItems();
  const addresses = await getAddresses();

  const mainAddress = addresses.find((address) => address.mainAddress);

  return (
    <div className="min-h-screen bg-background p-6 md:p-12 font-base mt-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center gap-4">
          <div className="inline-block bg-chart-5 px-3 py-1 text-xs font-bold uppercase text-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -rotate-2">
            Secure Checkout
          </div>
          <h1 className="text-3xl md:text-4xl font-heading uppercase tracking-tighter">
            Checkout
          </h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px] lg:gap-12 items-start">
          <div className="space-y-8">
            <section>
              <CheckoutAddressSection addresses={addresses} />
            </section>

            <section className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6">
              <h2 className="text-xl font-heading mb-4 uppercase tracking-tight border-b-2 border-black pb-2">
                Order Items{" "}
                <span className="text-gray-400 text-lg ml-2 font-sans normal-case">
                  ({items.length} items)
                </span>
              </h2>
              <div className="flex flex-col">
                {items.length > 0 ? (
                  items.map((item) => (
                    <CheckoutCartItem key={item.id} item={item} />
                  ))
                ) : (
                  <p className="text-muted-foreground py-4">
                    No items in cart.
                  </p>
                )}
              </div>
            </section>

            <section className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6">
              <CourierSelection items={items} mainAddress={mainAddress!} />
            </section>
          </div>

          <div className="lg:sticky lg:top-24">
            <CheckoutSummary items={items} />
          </div>
        </div>
      </div>
    </div>
  );
}
