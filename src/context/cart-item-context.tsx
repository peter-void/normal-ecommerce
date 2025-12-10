"use client";

import { CartItemContext } from "@/hooks/use-cart-item";
import { CartItemType } from "@/types";
import { useState } from "react";

export interface CartItemContextType {
  cartItems: CartItemType[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItemType[]>>;
  incrementQuantity: (cartItemId: string) => void;
  decrementQuantity: (cartItemId: string) => void;
  selectedItems: string[];
  setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>;
  removeCartItem: (cartItemId: string) => void;
}

export function CartItemContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const incrementQuantity = (cartItemId: string) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === cartItemId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decrementQuantity = (cartItemId: string) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === cartItemId ? { ...item, quantity: item.quantity - 1 } : item
      )
    );
  };

  const removeCartItem = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  return (
    <CartItemContext.Provider
      value={{
        cartItems,
        setCartItems,
        incrementQuantity,
        decrementQuantity,
        selectedItems,
        setSelectedItems,
        removeCartItem,
      }}
    >
      {children}
    </CartItemContext.Provider>
  );
}
