import { CheckoutContextType } from "@/context/checkout-context";
import { createContext, useContext } from "react";

export const CheckoutContext = createContext<CheckoutContextType | undefined>(
  undefined
);

export const useCheckout = () => {
  const context = useContext(CheckoutContext);

  if (!context) {
    throw new Error(
      "useCheckout must be used within a CheckoutContextProvider"
    );
  }

  return context;
};
