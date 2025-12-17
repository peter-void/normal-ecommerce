import { Button } from "../ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";

export function HeroSection() {
  return (
    <div className="bg-[#F5F5F5] relative overflow-hidden">
      {/* Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#000_1px,transparent_1px)] bg-size-[20px_20px] opacity-10 pointer-events-none" />

      <section className="container mx-auto px-7 py-20 lg:py-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="flex flex-col items-start gap-8">
            <div className="relative">
              <div className="absolute -top-3 -left-3 bg-black w-full h-full transform rotate-2" />
              <div className="relative bg-yellow-300 border-4 border-black px-6 py-2 text-sm font-black uppercase shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-transform cursor-default">
                New Collection 2025
              </div>
            </div>

            <h1 className="text-7xl lg:text-9xl font-black uppercase leading-[0.85] tracking-tighter italic">
              Bold <br />
              Style. <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-500 to-blue-600">
                No Limits.
              </span>
            </h1>

            <p className="text-xl font-medium max-w-lg text-gray-800 border-l-4 border-black pl-6">
              Express yourself with products that don&apos;t compromise. Maximum
              impact, zero boring.
            </p>

            <div className="flex items-center gap-6">
              <Button className="h-16 px-10 text-xl font-black uppercase bg-cyan-400 text-black border-4 border-black hover:bg-cyan-500 hover:text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
                Shop Now <ArrowRight className="ml-2 w-6 h-6" />
              </Button>
            </div>
          </div>

          <div className="relative group">
            {/* Decorative Elements */}
            <div className="absolute -top-12 -right-12 z-20 animate-bounce delay-700">
              <Sparkles className="w-12 h-12 text-yellow-400 fill-yellow-400 stroke-black stroke-2" />
            </div>

            <div className="aspect-4/5 md:aspect-square bg-pink-400 border-4 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden transform rotate-3 hover:rotate-0 transition-all duration-500 group-hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] group-hover:translate-x-[4px] group-hover:translate-y-[4px]">
              <Image
                src="/hero-brutal.jpg"
                alt="Hero Image"
                fill
                className="object-cover scale-110 group-hover:scale-100 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
