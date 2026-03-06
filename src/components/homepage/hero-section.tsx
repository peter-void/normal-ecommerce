import Link from "next/link";
import Image from "next/image";

export function HeroSection() {
  return (
    <div className="relative w-full" style={{ height: "calc(100vh - 72px)" }}>
      {/* Background image */}
      <Image
        src="/hero-brutal.jpg"
        alt="Hero Background"
        fill
        priority
        className="object-cover object-center"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/45" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-end px-8 md:px-16 pb-16">
        {/* Badge */}
        <p className="text-[#c8ff00] text-xs font-bold uppercase tracking-[0.2em] mb-4">
          FRESH DROP 2026
        </p>

        {/* Headline */}
        <h1
          className="text-white font-black uppercase leading-[0.88] tracking-[-0.02em] mb-8"
          style={{ fontSize: "clamp(60px, 9vw, 130px)" }}
        >
          BREAK RULES.
          <br />
          OWN IT.
        </h1>

        {/* CTA Buttons */}
        <div className="flex items-center gap-4 mb-12">
          <Link
            href="/products"
            className="bg-white text-black font-bold uppercase text-sm tracking-widest px-8 py-4 hover:bg-gray-100 transition-colors duration-200"
          >
            SHOP NOW
          </Link>
          <Link
            href="/products"
            className="border border-white text-white font-bold uppercase text-sm tracking-widest px-8 py-4 hover:bg-white/10 transition-colors duration-200"
          >
            EXPLORE
          </Link>
        </div>

        {/* Stats strip */}
        <div className="flex items-center gap-0 bg-white/10 backdrop-blur-sm w-fit divide-x divide-white/20">
          <div className="px-8 py-4 text-center">
            <p className="text-white font-black text-2xl">
              500+{" "}
              <span className="text-sm font-semibold text-white/70 tracking-widest uppercase ml-1">
                PRODUCTS
              </span>
            </p>
          </div>
          <div className="px-8 py-4 text-center">
            <p className="text-white font-black text-2xl">
              10k+{" "}
              <span className="text-sm font-semibold text-white/70 tracking-widest uppercase ml-1">
                CUSTOMERS
              </span>
            </p>
          </div>
          <div className="px-8 py-4 text-center">
            <p className="text-white font-black text-2xl">
              4.9★{" "}
              <span className="text-sm font-semibold text-white/70 tracking-widest uppercase ml-1">
                RATING
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
