import {
  fetchCartItems,
  getSelectedCartProductAction,
} from "@/features/carts/actions/action";
import { CartList } from "@/features/carts/components/cart-list";
import { EmptyCart } from "@/features/carts/components/empty-cart";
import { OrderSummary } from "@/features/carts/components/order-summary";

export default async function CartPage() {
  const { items: initialItems, nextCursor, hasMore } = await fetchCartItems();
  const selectedCartProducts = await getSelectedCartProductAction();
  const initialSelectedIds = selectedCartProducts.map((p) => p.product.id);

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="mx-auto max-w-8xl px-8 md:px-16 pt-28 pb-16">
        {/* Header */}
        <div className="mb-8 border-b border-gray-200 pb-6">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight">
            YOUR BAG{" "}
            {initialItems.length > 0 && (
              <span className="text-xl font-normal text-gray-500 tracking-normal">
                ({initialItems.length} item{initialItems.length > 1 ? "s" : ""})
              </span>
            )}
          </h1>
          {initialItems.length > 0 && (
            <p className="mt-1 text-sm text-gray-500">
              Items in your bag are not reserved — checkout now to make them
              yours.
            </p>
          )}
        </div>

        {initialItems.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid gap-12 lg:grid-cols-12 items-start">
            <div className="lg:col-span-8">
              <CartList
                initialItems={initialItems}
                initialCursor={nextCursor}
                initialHasMore={hasMore}
                initialSelectedIds={initialSelectedIds}
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
