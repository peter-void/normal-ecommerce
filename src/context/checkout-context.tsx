"use client";

import { Courier } from "@/constants";
import { CheckoutContext } from "@/hooks/use-checkout";
import { Level } from "@/types";
import { useState } from "react";

export interface CheckoutContextType {
  selectedCourierContext: Courier;
  setSelectedCourierContext: (courier: Courier) => void;
  selectedServiceContext: Level;
  setSelectedServiceContext: (service: Level) => void;
  totalBill: number;
  setTotalBill: (bill: number) => void;
}

export function CheckoutContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedCourierContext, setSelectedCourierContext] =
    useState<Courier>("jne");
  const [selectedServiceContext, setSelectedServiceContext] = useState<Level>({
    name: "",
    code: "",
    service: "",
    description: "",
    cost: 0,
    etd: "",
  });

  const [totalBill, setTotalBill] = useState<number>(0);

  return (
    <CheckoutContext.Provider
      value={{
        selectedCourierContext,
        setSelectedCourierContext,
        selectedServiceContext,
        setSelectedServiceContext,
        totalBill,
        setTotalBill,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
}
