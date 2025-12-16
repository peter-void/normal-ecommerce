import { fetchCartItems } from "@/features/carts/actions/action";
import { CartList } from "@/features/carts/components/cart-list";
import { EmptyCart } from "@/features/carts/components/empty-cart";
import { OrderSummary } from "@/features/carts/components/order-summary";

export default async function CartPage() {
  const { items: initialItems, nextCursor, hasMore } = await fetchCartItems();

  return (
    <div className="min-h-screen bg-background p-6 md:p-12 font-base mt-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <div className="inline-block bg-chart-5 px-3 py-0.5 text-[10px] font-bold uppercase text-white border-2 border-border shadow-shadow -rotate-2 mb-2">
            Checkout
          </div>
          <h1 className="text-4xl md:text-5xl font-heading uppercase tracking-tighter">
            Your Cart
          </h1>
          <p className="underline text-lg bg-black text-white p-2 rounded-md mt-2.5">
            You have to select at least one item, you can select by clicking the
            card of item
          </p>
        </div>

        {initialItems.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid gap-8 lg:grid-cols-3 lg:gap-12">
            <div className="lg:col-span-2">
              <CartList
                initialItems={initialItems}
                initialCursor={nextCursor}
                initialHasMore={hasMore}
              />
            </div>

            <OrderSummary />
          </div>
        )}
      </div>
    </div>
  );
}
