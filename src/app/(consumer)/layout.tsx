import { Navbar } from "@/components/layouts/navbar";
import { Footer } from "@/components/layouts/footer";
import { CartItemContextProvider } from "@/context/cart-item-context";
import { CheckoutContextProvider } from "@/context/checkout-context";
import { getPublicCategories } from "@/dal/getCategories";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const allCategories = await getPublicCategories();
  const categories = allCategories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
  }));

  return (
    <CheckoutContextProvider>
      <CartItemContextProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar categories={categories} />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </CartItemContextProvider>
    </CheckoutContextProvider>
  );
}
