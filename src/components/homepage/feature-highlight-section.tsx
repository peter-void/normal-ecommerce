import { ShieldCheck, Truck, Zap } from "lucide-react";

export function FeatureHighlightSection() {
  return (
    <div className="bg-[#E0E7FF] py-20 relative overflow-hidden">
      {/* Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#000_1px,transparent_1px)] bg-size-[20px_20px] opacity-5 pointer-events-none" />

      <section className="container mx-auto px-7 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="group bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:scale-105 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all cursor-default">
            <div className="flex flex-col gap-4">
              <div className="w-16 h-16 bg-cyan-400 border-4 border-black flex items-center justify-center transform -rotate-6 group-hover:rotate-0 transition-transform">
                <Zap className="size-8 stroke-[3px]" />
              </div>
              <div>
                <h3 className="font-black uppercase text-2xl leading-tight mb-1">
                  Fast Shipping
                </h3>
                <p className="text-base font-medium text-gray-600">
                  2-3 Days Delivery
                </p>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="group bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:scale-105 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all cursor-default">
            <div className="flex flex-col gap-4">
              <div className="w-16 h-16 bg-pink-500 border-4 border-black flex items-center justify-center transform rotate-6 group-hover:rotate-0 transition-transform">
                <ShieldCheck className="size-8 stroke-[3px] text-white" />
              </div>
              <div>
                <h3 className="font-black uppercase text-2xl leading-tight mb-1">
                  100% Secure
                </h3>
                <p className="text-base font-medium text-gray-600">
                  Safe Payments
                </p>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="group bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:scale-105 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all cursor-default">
            <div className="flex flex-col gap-4">
              <div className="w-16 h-16 bg-yellow-400 border-4 border-black flex items-center justify-center transform -rotate-3 group-hover:rotate-0 transition-transform">
                <Truck className="size-8 stroke-[3px]" />
              </div>
              <div>
                <h3 className="font-black uppercase text-2xl leading-tight mb-1">
                  Free Returns
                </h3>
                <p className="text-base font-medium text-gray-600">
                  30 Days Policy
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
