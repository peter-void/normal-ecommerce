import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function EmptyCart() {
  return (
    <div className="py-16 px-2">
      <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4">
        Your Bag Is Empty
      </h2>
      <p className="text-gray-500 text-sm mb-8 max-w-md">
        Once you add something to your bag, it will show up here. Ready to
        start?
      </p>
      <Link
        href="/products"
        className="inline-flex items-center justify-between gap-8 bg-black text-white px-6 py-4 font-bold uppercase tracking-widest text-sm hover:bg-gray-800 transition-colors min-w-[200px]"
      >
        <span>Start Shopping</span>
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
