"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Category } from "@/generated/prisma/client";
import { formatRupiah } from "@/lib/format";
import {
  Image as ImageIcon,
  Package,
  Pencil,
  Settings2,
  ShoppingCart,
} from "lucide-react";
import { useState } from "react";
import { AddNewProductForm } from "./add-new-product-form";
import { generatePublicImageURL } from "@/lib/utils";

export function EditProductButton({
  product,
  categories,
}: {
  product: any;
  categories: Category[];
}) {
  const [open, setOpen] = useState(false);
  const [watchedValues, setWatchedValues] = useState<any>({
    name: product.name || "",
    price: product.price || 0,
    stock: product.stock || 0,
    categoryId: product.categoryId || "",
    description: product.description || "",
    isActive: product.isActive ?? true,
    image:
      product.images.map((img: any) => ({
        id: img.id,
        key: img.key,
        src: generatePublicImageURL(img.key),
        alt: img.id,
      })) || [],
    slug: product.slug || "",
  });

  const selectedCategoryName =
    categories.find((c) => c.id === watchedValues.categoryId)?.name ||
    "Category";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          className="h-10 w-10 border-2 border-border bg-white text-black hover:bg-main hover:text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
        >
          <Pencil className="h-4 w-4" />
          <span className="sr-only">Edit</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[1200px] p-0 border-4 border-border shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden bg-secondary-background">
        <div className="flex flex-col lg:flex-row h-full max-h-[90vh]">
          {/* Left Side: Form */}
          <div className="flex-1 flex flex-col border-r-4 border-border bg-white overflow-hidden">
            <DialogHeader className="bg-main p-8 border-b-4 border-border shrink-0">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white rounded-base border-2 border-border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <Settings2 className="w-5 h-5 text-main" />
                </div>
                <DialogTitle className="text-3xl font-heading text-main-foreground">
                  Update Product
                </DialogTitle>
              </div>
              <DialogDescription className="text-main-foreground/90 font-base text-lg">
                Refine the details of your listing.
              </DialogDescription>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <AddNewProductForm
                categories={categories}
                product={product}
                isEditMode={true}
                onValuesChange={setWatchedValues}
                onSuccess={() => setOpen(false)}
                isDialogMode
              />
            </div>
          </div>

          {/* Right Side: Visual Preview */}
          <div className="hidden lg:flex w-[400px] bg-secondary-background flex-col items-center justify-center p-10 text-center relative overflow-hidden shrink-0">
            {/* Background Decorative Element */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-main/20 -mr-16 -mt-16 rounded-full blur-3xl opacity-50" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-main/10 -ml-32 -mb-32 rounded-full blur-3xl opacity-50" />

            <div className="relative z-10 w-full space-y-8">
              <div className="space-y-3">
                <span className="text-sm font-bold uppercase tracking-[0.3em] text-muted-foreground">
                  Product Preview
                </span>
                <div className="h-1.5 w-16 bg-main mx-auto border-2 border-border shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]" />
              </div>

              {/* Mock Store Card */}
              <div className="w-full bg-white border-4 border-border rounded-2xl shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] overflow-hidden transition-all hover:rotate-1">
                <div className="h-56 bg-zinc-50 flex items-center justify-center border-b-4 border-border relative">
                  {watchedValues.image && watchedValues.image.length > 0 ? (
                    <img
                      src={watchedValues.image[0].src || ""}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-3 text-muted-foreground/30">
                      <ImageIcon className="w-16 h-16" />
                      <span className="text-sm font-heading">
                        Product Image
                      </span>
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    <Badge
                      className={`border-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] font-heading ${
                        watchedValues.isActive
                          ? "bg-green-400 text-black"
                          : "bg-zinc-200 text-zinc-500"
                      }`}
                    >
                      {watchedValues.isActive ? "IN STOCK" : "OUT OF STOCK"}
                    </Badge>
                  </div>
                </div>
                <div className="p-6 text-left space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge
                      variant="neutral"
                      className="px-2 py-0.5 text-[10px] uppercase font-bold border-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-zinc-100 text-zinc-600"
                    >
                      {selectedCategoryName}
                    </Badge>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-main/80 uppercase">
                      <Package className="w-3" />
                      {watchedValues.stock} in stock
                    </div>
                  </div>

                  <h4 className="font-heading text-2xl truncate leading-none pt-1">
                    {watchedValues.name || "Product Name"}
                  </h4>

                  <div className="flex items-end justify-between gap-4">
                    <div className="space-y-1">
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">
                        Current Price
                      </p>
                      <p className="font-heading text-2xl text-main">
                        {formatRupiah(watchedValues.price)}
                      </p>
                    </div>
                    <Button
                      size="icon"
                      className="h-12 w-12 border-2 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] pointer-events-none"
                    >
                      <ShoppingCart className="w-5 h-5" />
                    </Button>
                  </div>

                  <div className="pt-4 border-t-2 border-border border-dashed">
                    <p className="text-[10px] text-muted-foreground line-clamp-2 italic leading-relaxed">
                      {watchedValues.description || "Describe your product..."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/40 backdrop-blur-md border-2 border-border p-5 rounded-xl">
                <p className="text-xs font-base text-muted-foreground leading-relaxed">
                  Editing mode: Changes are reflected instantly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
