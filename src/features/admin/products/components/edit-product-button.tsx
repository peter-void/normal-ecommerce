"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Category } from "@/generated/prisma/client";
import { formatRupiah } from "@/lib/format";
import { generatePublicImageURL } from "@/lib/utils";
import { Image as ImageIcon, Pencil, X } from "lucide-react";
import { useState } from "react";
import { AddNewProductForm } from "./add-new-product-form";

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
          className="h-8 w-8 border border-gray-200 bg-white text-gray-400 hover:bg-black hover:text-white hover:border-black transition-colors rounded-none"
        >
          <Pencil className="h-3.5 w-3.5" />
          <span className="sr-only">Edit</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[1100px] p-0 border-0 shadow-2xl overflow-hidden bg-white rounded-none">
        <div className="flex flex-col lg:flex-row h-full max-h-[90vh]">
          {/* ─── LEFT: Form ─── */}
          <div className="flex-1 flex flex-col border-r border-gray-100 bg-white overflow-hidden">
            <div className="px-8 pt-8 pb-6 border-b border-gray-100 flex items-start justify-between shrink-0">
              <div>
                <DialogTitle className="text-2xl font-black uppercase tracking-tight leading-none">
                  Update Product
                </DialogTitle>
                <DialogDescription className="text-xs text-gray-400 uppercase tracking-widest mt-1 font-bold">
                  Editing — {product.name}
                </DialogDescription>
              </div>
              <DialogClose className="text-gray-300 hover:text-black transition-colors mt-0.5">
                <X className="w-5 h-5" />
              </DialogClose>
            </div>

            <div className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar">
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

          {/* ─── RIGHT: Live Preview ─── */}
          <div className="hidden lg:flex w-[320px] bg-gray-50 border-l border-gray-100 flex-col overflow-hidden shrink-0">
            <div className="px-6 py-5 border-b border-gray-100">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                Live Preview
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Product card */}
              <div className="bg-white border border-gray-200 overflow-hidden">
                <div className="aspect-square bg-gray-100 relative overflow-hidden flex items-center justify-center">
                  {watchedValues.image && watchedValues.image.length > 0 ? (
                    <img
                      src={watchedValues.image[0].src || ""}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-gray-300">
                      <ImageIcon className="w-8 h-8" />
                      <span className="text-[9px] font-bold uppercase tracking-widest">
                        No Image
                      </span>
                    </div>
                  )}
                  <div className="absolute top-0 right-0">
                    <div
                      className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-widest ${
                        watchedValues.isActive
                          ? "bg-black text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {watchedValues.isActive ? "Active" : "Draft"}
                    </div>
                  </div>
                </div>
                <div className="p-4 space-y-1">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 bg-gray-100 px-1.5 py-0.5 inline-block">
                    {selectedCategoryName}
                  </p>
                  <h3 className="font-black text-sm uppercase tracking-tight leading-tight">
                    {watchedValues.name || "Product Name"}
                  </h3>
                  <p className="font-black text-base">
                    {formatRupiah(watchedValues.price)}
                  </p>
                  <p className="text-[10px] text-gray-400 line-clamp-2">
                    {watchedValues.description || "Description..."}
                  </p>
                </div>
              </div>

              {/* Meta rows */}
              <div className="space-y-0">
                {[
                  { label: "Name", value: watchedValues.name || "—" },
                  { label: "Price", value: formatRupiah(watchedValues.price) },
                  { label: "Stock", value: `${watchedValues.stock} units` },
                  { label: "Category", value: selectedCategoryName },
                  {
                    label: "Status",
                    value: watchedValues.isActive ? "Active" : "Draft",
                  },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between py-2 border-b border-gray-100"
                  >
                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                      {row.label}
                    </span>
                    <span className="text-xs font-bold truncate max-w-[140px]">
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
