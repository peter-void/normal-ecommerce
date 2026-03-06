"use client";

import dynamic from "next/dynamic";
import { Address } from "@/generated/prisma/client";
import { CartItemType } from "@/types";

const CourierSelectionDynamic = dynamic(
  () => import("./courier-selection").then((m) => m.CourierSelection),
  { ssr: false },
);

interface Props {
  items: CartItemType[];
  mainAddress: Address | undefined;
}

export function CourierSelectionWrapper({ items, mainAddress }: Props) {
  return <CourierSelectionDynamic items={items} mainAddress={mainAddress} />;
}
