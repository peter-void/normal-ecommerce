import { Navbar } from "@/components/layouts/navbar";
import { CartItemContextProvider } from "@/context/cart-item-context";
import { CheckoutContextProvider } from "@/context/checkout-context";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <CheckoutContextProvider>
      <CartItemContextProvider>
        <div>
          <Navbar />
          {children}
        </div>
      </CartItemContextProvider>
    </CheckoutContextProvider>
  );
}
