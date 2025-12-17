import { fetchCartItems } from "@/features/carts/actions/action";
import { CartList } from "@/features/carts/components/cart-list";
import { EmptyCart } from "@/features/carts/components/empty-cart";
import { OrderSummary } from "@/features/carts/components/order-summary";
import { Sparkles } from "lucide-react";

export default async function CartPage() {
  const { items: initialItems, nextCursor, hasMore } = await fetchCartItems();

  return (
    <div className="min-h-screen bg-[#FFF0F5] p-6 md:p-12 font-sans  relative overflow-x-hidden">
      {/* Decorative Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#000_1px,transparent_1px)] bg-size-[20px_20px] opacity-10 pointer-events-none" />

      <div className="mx-auto max-w-6xl relative z-10 mt-20">
        <div className="mb-12 flex flex-col md:flex-row md:items-end gap-6 border-b-4 border-black pb-8">
          <div className="relative">
            <div className="absolute -top-6 -left-6 bg-yellow-400 border-4 border-black px-4 py-1 transform -rotate-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <span className="font-black uppercase text-sm tracking-wider">
                Secure Checkout
              </span>
            </div>
            <h1 className="text-6xl md:text-7xl font-black uppercase italic tracking-tighter text-transparent bg-clip-text bg-linear-to-r from-pink-500 via-purple-500 to-indigo-500 leading-[0.9]">
              Your
              <br />
              Loot
            </h1>
          </div>

          <div className="md:ml-auto max-w-md">
            <div className="bg-white border-4 border-black p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex gap-4 items-start">
              <Sparkles className="w-8 h-8 text-yellow-500 shrink-0 fill-yellow-500" />
              <p className="font-bold text-sm leading-tight">
                Review your items carefully. Once you checkout, these awesome
                items are practically yours!
              </p>
            </div>
          </div>
        </div>

        {initialItems.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid gap-8 lg:grid-cols-12 items-start">
            <div className="lg:col-span-8">
              <CartList
                initialItems={initialItems}
                initialCursor={nextCursor}
                initialHasMore={hasMore}
              />
            </div>

            <div className="lg:col-span-4 sticky top-24">
              <OrderSummary />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
