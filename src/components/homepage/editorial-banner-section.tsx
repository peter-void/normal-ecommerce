import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

export function EditorialBannerSection() {
  return (
    <section className="w-full py-16 px-4 md:px-7 bg-white">
      <div className="container mx-auto">
        {/* Section label */}
        <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-8">
          ✦ EXPLORE THE COLLECTION
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Panel 1: New Arrivals */}
          <Link
            href="/products?sort=newest"
            className="group relative flex flex-col justify-end overflow-hidden bg-[#0a0a0a] min-h-[320px] md:min-h-[420px]"
          >
            {/* Background texture */}
            <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_30px,rgba(255,255,255,0.02)_30px,rgba(255,255,255,0.02)_31px)] group-hover:opacity-0 transition-opacity duration-500" />

            {/* Number */}
            <span className="absolute top-6 left-6 font-black text-[80px] leading-none text-white/5 select-none">
              01
            </span>

            {/* Content */}
            <div className="relative p-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500 mb-2">
                COLLECTION
              </p>
              <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white leading-tight mb-4">
                NEW
                <br />
                ARRIVALS
              </h3>
              <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-white/60 group-hover:text-white transition-colors duration-200">
                Shop Now
                <ArrowRightIcon className="w-3.5 h-3.5 translate-x-0 group-hover:translate-x-1 transition-transform duration-200" />
              </div>
            </div>

            {/* Bottom accent line */}
            <div className="absolute bottom-0 left-0 w-0 group-hover:w-full h-0.5 bg-white transition-all duration-500 ease-out" />
          </Link>

          {/* Panel 2: Best Sellers */}
          <div className="flex flex-col gap-4">
            {/* Sub panel 2a: Best Sellers */}
            <Link
              href="/products?sort=best-sellers"
              className="group relative flex flex-col justify-end overflow-hidden bg-[#f5f5f5] flex-1 min-h-[200px]"
            >
              <span className="absolute top-4 left-6 font-black text-[60px] leading-none text-black/5 select-none">
                02
              </span>

              <div className="relative p-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-1">
                  TOP PICKS
                </p>
                <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight text-black leading-tight mb-3">
                  BEST SELLERS
                </h3>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 group-hover:text-black transition-colors duration-200">
                  Explore
                  <ArrowRightIcon className="w-3 h-3 translate-x-0 group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </div>

              <div className="absolute bottom-0 left-0 w-0 group-hover:w-full h-0.5 bg-black transition-all duration-500 ease-out" />
            </Link>

            {/* Sub panel 2b: Categories */}
            <Link
              href="/categories"
              className="group relative flex flex-col justify-end overflow-hidden bg-black flex-1 min-h-[200px]"
            >
              {/* Dot pattern */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, white 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              />

              <span className="absolute top-4 left-6 font-black text-[60px] leading-none text-white/5 select-none">
                03
              </span>

              <div className="relative p-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500 mb-1">
                  BROWSE
                </p>
                <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white leading-tight mb-3">
                  ALL CATEGORIES
                </h3>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 group-hover:text-white transition-colors duration-200">
                  View All
                  <ArrowRightIcon className="w-3 h-3 translate-x-0 group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </div>

              <div className="absolute bottom-0 left-0 w-0 group-hover:w-full h-0.5 bg-white transition-all duration-500 ease-out" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
