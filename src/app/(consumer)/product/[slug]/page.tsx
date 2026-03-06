import { getProductByKey, getRelatedProducts } from "@/dal/getProducts";
import { checkWishlist } from "@/dal/wishlist-check";
import { AddToCartForm } from "@/features/products/components/add-to-cart-form";
import { ProductGallery } from "@/features/products/components/product-gallery";
import { ProductInfo } from "@/features/products/components/product-info";
import { FeaturedProductCard } from "@/components/homepage/featured-product-card";
import { PageProps } from "@/types";
import { notFound } from "next/navigation";

export default async function Page({ params }: PageProps) {
  const slug = (await params)?.slug as string;
  const product = await getProductByKey(slug);

  if (!product) {
    notFound();
  }

  const productImages = product.images.map((img: any) => ({
    src: img.src,
    alt: img.alt || product.name,
  }));

  if (productImages.length === 0) {
    productImages.push({
      src: "/placeholder-product.jpg",
      alt: product.name,
    });
  }

  const isWishlist = await checkWishlist(product.id);

  const relatedProducts = await getRelatedProducts(
    product.categoryId,
    product.id,
    4,
  );

  return (
    <div className="flex flex-col min-h-screen w-full relative overflow-x-hidden bg-white text-black">
      {/* Adidas-style two-column layout: full-bleed gallery left, sticky info right */}
      <div className="flex flex-col lg:flex-row items-start w-full relative z-10">
        {/* Image gallery — no padding, takes ~60% of viewport */}
        <div className="w-full lg:w-[60%] xl:w-[62%]">
          <ProductGallery images={productImages} />
        </div>

        {/* Product info — sticky sidebar */}
        <div className="w-full lg:w-[40%] xl:w-[38%] lg:sticky lg:top-[72px] lg:max-h-[calc(100vh-72px)] lg:overflow-y-auto">
          <div className="bg-white px-6 py-10 md:px-10 xl:px-14 relative">
            <ProductInfo
              title={product.name}
              price={product.price}
              description={product.description}
              category={product.category?.name}
            />

            <AddToCartForm
              productId={product.id}
              stock={product.stock}
              isWishlist={isWishlist}
            />
          </div>
        </div>
      </div>

      {/* Related products section */}
      <div className="container mx-auto px-4 pb-24">
        {relatedProducts.length > 0 && (
          <div className="mt-24 border-t border-gray-200 pt-16">
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-black mb-10">
              YOU MIGHT ALSO LIKE
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-8">
              {relatedProducts.map((relatedProduct) => (
                <FeaturedProductCard
                  key={relatedProduct.id}
                  product={relatedProduct}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
