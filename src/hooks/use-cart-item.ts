import { CartItemContextType } from "@/context/cart-item-context";
import { createContext, useContext } from "react";

export const CartItemContext = createContext<CartItemContextType | undefined>(
  undefined
);

export const useCartItem = () => {
  const context = useContext(CartItemContext);

  if (!context) {
    throw new Error("useCart must be used within a CartItemContextProvider");
  }

  return context;
};
