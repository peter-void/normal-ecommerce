import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";

export function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-16 border-2 border-border bg-white shadow-shadow p-6 text-center">
      <ShoppingBag className="w-20 h-20 mb-6 text-muted-foreground" />
      <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
      <p className="text-muted-foreground mb-8">
        Looks like you haven't added anything to your cart yet.
      </p>
      <Button
        className="bg-main text-main-foreground px-8 py-3 font-bold border-2 border-border shadow-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
        asChild
      >
        <Link href="/">Start Shopping</Link>
      </Button>
    </div>
  );
}
