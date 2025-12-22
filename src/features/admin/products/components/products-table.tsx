"use client";

import { AlertDialogActionButton } from "@/components/alert-dialog-action-button";
import { Badge } from "@/components/ui/badge";
import { Category } from "@/generated/prisma/client";
import { formatDateString, formatRupiah } from "@/lib/format";
import { ProductTableProps } from "@/types";
import {
  Calendar,
  Image as ImageIcon,
  Package,
  Star,
  Trash2,
} from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { deleteProduct } from "../actions/action";
import { EditProductButton } from "./edit-product-button";

export function ProductsTable({
  products,
  skip,
  categories,
}: ProductTableProps & { categories: Category[] }) {
  const [isDeleting, startDeleting] = useTransition();

  const handleDeleteProduct = async (pID: string) => {
    startDeleting(async () => {
      const { success, message } = await deleteProduct(pID);

      if (!success) {
        toast.error(message);
      } else {
        toast.success(message);
      }
    });
  };

  return (
    <table className="w-full text-left border-collapse">
      <thead className="bg-main text-main-foreground border-b-4 border-border font-heading uppercase text-xs tracking-[0.2em]">
        <tr>
          <th className="p-6 font-bold text-center w-16">#</th>
          <th className="p-6 font-bold">Product Details</th>
          <th className="p-6 font-bold w-40">Price / Inventory</th>
          <th className="p-6 font-bold w-32 text-center">Featured</th>
          <th className="p-6 font-bold w-32 text-center">Status</th>
          <th className="p-6 font-bold w-44">Timeline</th>
          <th className="p-6 font-bold text-right w-32">Actions</th>
        </tr>
      </thead>
      <tbody className="bg-white">
        {products.map((product, i) => (
          <tr
            key={product.id}
            className="group border-b-2 border-border transition-all hover:bg-main/5"
          >
            <td className="p-6 text-center">
              <div className="inline-flex h-8 w-8 items-center justify-center rounded-base border-2 border-border bg-white font-heading text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                {i + skip + 1}
              </div>
            </td>
            <td className="p-6">
              <div className="flex items-center gap-5">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 border-border bg-zinc-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:scale-105 transition-transform">
                  {product.images.length > 0 ? (
                    <img
                      src={product.images[0].src || "/placeholder.png"}
                      alt={product.images[0].alt || product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-100 text-muted-foreground/30">
                      <ImageIcon className="h-8 w-8" />
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1.5 min-w-0">
                  <span className="font-heading text-xl truncate">
                    {product.name}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant="neutral"
                      className="px-2 py-0.5 text-[10px] border-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    >
                      {product.category.name}
                    </Badge>
                    <Badge className="px-2 py-0.5 text-[10px] border-2 bg-zinc-100 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      {product.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </td>
            <td className="p-6">
              <div className="flex flex-col gap-2">
                <div className="font-heading text-lg text-main">
                  {formatRupiah(product.price)}
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`flex items-center gap-1.5 px-2 py-0.5 rounded-base border-2 border-border text-[10px] font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                      product.stock <= 10
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    <Package className="h-3 w-3" />
                    {product.stock} units
                  </div>
                </div>
              </div>
            </td>
            <td className="p-6 text-center">
              <div className="flex items-center justify-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-base border-2 border-border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all ${
                    product.isFeatured ? "bg-yellow-400" : "bg-zinc-100"
                  }`}
                >
                  <Star
                    className={`h-5 w-5 ${
                      product.isFeatured
                        ? "text-black fill-black"
                        : "text-zinc-400"
                    }`}
                  />
                </div>
              </div>
            </td>
            <td className="p-6 text-center">
              <Badge
                className={`w-full py-1 justify-center border-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] font-heading transition-colors ${
                  product.isActive
                    ? "bg-green-400 text-black hover:bg-green-500"
                    : "bg-gray-200 text-gray-500 hover:bg-gray-300"
                }`}
              >
                {product.isActive ? "ACTIVE" : "DRAFT"}
              </Badge>
            </td>
            <td className="p-6">
              <div className="flex flex-col gap-1 text-xs font-base text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3 text-main" />
                  <span className="font-bold text-black">
                    {formatDateString(product.createdAt)}
                  </span>
                </div>
                <div className="pl-5 text-[10px] italic opacity-70 uppercase font-bold tracking-tight">
                  Created In Store
                </div>
              </div>
            </td>
            <td className="p-6 text-right">
              <div className="flex justify-end gap-3">
                <EditProductButton product={product} categories={categories} />
                <AlertDialogActionButton
                  action={() => handleDeleteProduct(product.id)}
                  buttonContent={
                    <>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </>
                  }
                  dialogTitle="Archive Product"
                  dialogDescription="This will permanently remove the product from the catalog. This action cannot be undone."
                  triggerButtonSize="icon"
                  disabled={isDeleting}
                  isPending={isDeleting}
                  className="h-10 w-10 bg-white border-2 border-border text-black transition-all hover:bg-red-400 hover:text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
