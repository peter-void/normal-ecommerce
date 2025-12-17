import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingCart, Telescope } from "lucide-react";
import Link from "next/link";

export function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
      <div className="relative mb-8 group">
        <div className="absolute inset-0 bg-black translate-x-4 translate-y-4 rounded-full" />
        <div className="relative w-40 h-40 bg-white border-4 border-black rounded-full flex items-center justify-center group-hover:-translate-y-2 group-hover:-translate-x-2 transition-transform duration-300">
          <Telescope className="w-20 h-20 text-gray-400 group-hover:text-purple-600 transition-colors" />
        </div>
      </div>

      <h2 className="text-4xl font-black uppercase italic mb-4 tracking-tight">
        It's... Empty?!
      </h2>
      <p className="text-xl font-medium text-gray-600 mb-10 max-w-md">
        Looks like you haven't found your obsession yet. The void is calling,
        fill it with cool stuff!
      </p>

      <Button
        className="h-16 px-10 text-xl font-black uppercase bg-yellow-400 text-black border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-500 transition-all active:translate-x-[8px] active:translate-y-[8px] active:shadow-none"
        asChild
      >
        <Link href="/">
          <ArrowLeft className="mr-2 w-6 h-6" />
          Start Hunting
        </Link>
      </Button>
    </div>
  );
}
