"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { WishlistCard, WishlistItemExtended } from "./wishlist-card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Loader2, ShoppingBag } from "lucide-react";

export function WishlistContentPage() {
  const [items, setItems] = useState<WishlistItemExtended[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(true);

  const fetchWishlist = async () => {
    setIsFetching(true);
    try {
      const response = await fetch(`/api/wishlist`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch wishlist");
      }

      const data = await response.json();
      setItems(data.items || []);
    } catch (error) {
      console.log({ error });
      toast.error("Failed to fetch wishlist");
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  if (isFetching) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-black" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 border border-dashed border-gray-300 bg-gray-50">
        <div className="w-16 h-16 bg-black flex items-center justify-center mb-6">
          <ShoppingBag className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-xl font-black uppercase tracking-tight text-black mb-2">
          Your Wishlist is Empty
        </h2>
        <p className="text-gray-500 text-sm text-center max-w-xs mb-8">
          Looks like you haven&apos;t added any items to your wishlist yet.
          Browse products and save your favorites.
        </p>
        <Link href="/products">
          <Button className="h-11 px-8 font-bold bg-black text-white hover:bg-gray-800 uppercase tracking-widest text-xs rounded-none">
            Start Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-black uppercase tracking-tight">
          My Wishlist <span className="text-gray-400">({items.length})</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((item) => (
          <WishlistCard key={item.id} item={item} onRemove={handleRemoveItem} />
        ))}
      </div>
    </div>
  );
}
