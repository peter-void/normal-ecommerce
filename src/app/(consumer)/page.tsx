import { FeatureHighlightSection } from "@/components/homepage/feature-highlight-section";
import { FeaturedProductsSection } from "@/components/homepage/featured-products-section";
import { HeroSection } from "@/components/homepage/hero-section";
import { MarqueeSeparator } from "@/components/ui/marquee-separator";

export default function Home() {
  return (
    <div className="flex flex-col w-full overflow-x-hidden">
      <HeroSection />

      <MarqueeSeparator
        text="NEW ARRIVALS • LIMITED EDITION • "
        className="bg-black text-white"
        reverse={false}
      />

      <FeatureHighlightSection />

      <MarqueeSeparator
        text="BEST SELLERS • DON'T MISS OUT • "
        className="bg-yellow-400 border-black"
        reverse={true}
      />

      <FeaturedProductsSection />
    </div>
  );
}
