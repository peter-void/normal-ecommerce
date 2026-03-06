import { RefreshCcw, ShieldCheck, Truck } from "lucide-react";

export function FeatureHighlightSection() {
  return (
    <div className="bg-[#f5f5f5] border-b border-gray-200">
      <div className="container mx-auto px-7">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
          {/* Fast Shipping */}
          <div className="flex items-start gap-4 py-6 px-4 md:px-8">
            <div className="shrink-0 mt-0.5">
              <Truck className="w-6 h-6 text-black" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="font-black uppercase text-sm tracking-widest text-black mb-1">
                FAST SHIPPING
              </h3>
              <p className="text-gray-500 text-xs leading-relaxed">
                Express delivery to your doorstep within 2-3 business days.
              </p>
            </div>
          </div>

          {/* 100% Secure */}
          <div className="flex items-start gap-4 py-6 px-4 md:px-8">
            <div className="shrink-0 mt-0.5">
              <ShieldCheck className="w-6 h-6 text-black" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="font-black uppercase text-sm tracking-widest text-black mb-1">
                100% SECURE
              </h3>
              <p className="text-gray-500 text-xs leading-relaxed">
                All transactions are encrypted and fully protected.
              </p>
            </div>
          </div>

          {/* Free Returns */}
          <div className="flex items-start gap-4 py-6 px-4 md:px-8">
            <div className="shrink-0 mt-0.5">
              <RefreshCcw className="w-6 h-6 text-black" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="font-black uppercase text-sm tracking-widest text-black mb-1">
                FREE RETURNS
              </h3>
              <p className="text-gray-500 text-xs leading-relaxed">
                Not satisfied? Return any item within 30 days, free.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
