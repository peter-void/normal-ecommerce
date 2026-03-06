import { EditorialBannerSection } from "@/components/homepage/editorial-banner-section";
import { FeatureHighlightSection } from "@/components/homepage/feature-highlight-section";
import { FeaturedProductsSection } from "@/components/homepage/featured-products-section";
import { HeroSection } from "@/components/homepage/hero-section";
import { OutOfStockSection } from "@/components/homepage/out-of-stock-section";
import { MarqueeSeparator } from "@/components/ui/marquee-separator";

export default function Home() {
  return (
    <div className="flex flex-col w-full overflow-x-hidden pt-[72px]">
      <HeroSection />

      <MarqueeSeparator
        text="NEW ARRIVALS • LIMITED EDITION • BRUTAL DROPS • EXCLUSIVE STYLES • NEW ARRIVALS • LIMITED EDITION • BRUTAL DROPS • EXCLUSIVE STYLES •"
        className="bg-black text-white py-3"
        reverse={false}
      />

      <FeatureHighlightSection />

      <MarqueeSeparator
        text="TRENDING NOW • BEST SELLERS • DON'T MISS OUT • TOP RATED • TRENDING NOW • BEST SELLERS • DON'T MISS OUT • TOP RATED •"
        className="bg-black text-white py-3"
        reverse={true}
      />

      <FeaturedProductsSection />

      <EditorialBannerSection />

      <OutOfStockSection />
    </div>
  );
}
