"use client";

import { AlertDialogActionButton } from "@/components/alert-dialog-action-button";
import { Badge } from "@/components/ui/badge";
import { Category } from "@/generated/prisma/client";
import { formatDateString, formatRupiah } from "@/lib/format";
import { ProductTableProps } from "@/types";
import {
  Image as ImageIcon,
  Package,
  Pencil,
  Star,
  Trash2,
} from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { deleteProduct } from "../actions/action";
import { EditProductButton } from "./edit-product-button";
import { cn } from "@/lib/utils";

export function ProductsTable({
  products,
  skip,
  categories,
}: ProductTableProps & { categories: Category[] }) {
  const [isDeleting, startDeleting] = useTransition();

  const handleDeleteProduct = async (pID: string) => {
    startDeleting(async () => {
      const { success, message } = await deleteProduct(pID);
      if (!success) toast.error(message);
      else toast.success(message);
    });
  };

  return (
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="border-b border-gray-200 bg-gray-50">
          <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-500 w-12 text-center">
            #
          </th>
          <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-500">
            Product
          </th>
          <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-500 w-36">
            Price
          </th>
          <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-500 w-28">
            Stock
          </th>
          <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-500 w-28 text-center">
            Featured
          </th>
          <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-500 w-24 text-center">
            Status
          </th>
          <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-500 w-32">
            Added
          </th>
          <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-500 w-24 text-right">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-100">
        {products.map((product, i) => (
          <tr
            key={product.id}
            className="group hover:bg-gray-50 transition-colors"
          >
            {/* # */}
            <td className="px-5 py-4 text-center">
              <span className="text-xs font-bold text-gray-400">
                {i + skip + 1}
              </span>
            </td>

            {/* Product */}
            <td className="px-5 py-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 shrink-0 border border-gray-100 bg-gray-50 overflow-hidden relative">
                  {product.images.length > 0 ? (
                    <img
                      src={product.images[0].src || "/placeholder.png"}
                      alt={product.images[0].alt || product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <ImageIcon className="h-5 w-5 text-gray-300" />
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-sm truncate max-w-[200px]">
                    {product.name}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-gray-100 px-1.5 py-0.5">
                      {product.category.name}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-gray-100 px-1.5 py-0.5">
                      {product.status}
                    </span>
                  </div>
                </div>
              </div>
            </td>

            {/* Price */}
            <td className="px-5 py-4">
              <span className="font-black text-sm">
                {formatRupiah(product.price)}
              </span>
            </td>

            {/* Stock */}
            <td className="px-5 py-4">
              <span
                className={cn(
                  "inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5",
                  product.stock <= 0
                    ? "bg-gray-200 text-gray-500"
                    : product.stock <= 10
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-700",
                )}
              >
                <Package className="h-3 w-3" />
                {product.stock} units
              </span>
            </td>

            {/* Featured */}
            <td className="px-5 py-4 text-center">
              <div
                className={cn(
                  "inline-flex h-7 w-7 items-center justify-center",
                  product.isFeatured
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-300",
                )}
              >
                <Star
                  className={cn(
                    "h-3.5 w-3.5",
                    product.isFeatured && "fill-white",
                  )}
                />
              </div>
            </td>

            {/* Status */}
            <td className="px-5 py-4 text-center">
              <span
                className={cn(
                  "text-[10px] font-bold uppercase tracking-widest px-2.5 py-1",
                  product.isActive
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-500",
                )}
              >
                {product.isActive ? "Active" : "Draft"}
              </span>
            </td>

            {/* Added */}
            <td className="px-5 py-4">
              <span className="text-xs text-gray-400 font-mono">
                {formatDateString(product.createdAt)}
              </span>
            </td>

            {/* Actions */}
            <td className="px-5 py-4 text-right">
              <div className="flex justify-end gap-2">
                <EditProductButton product={product} categories={categories} />
                <AlertDialogActionButton
                  action={() => handleDeleteProduct(product.id)}
                  buttonContent={
                    <>
                      <Trash2 className="h-3.5 w-3.5" />
                      <span className="sr-only">Delete</span>
                    </>
                  }
                  dialogTitle="Delete Product"
                  dialogDescription="This will permanently remove the product. This action cannot be undone."
                  triggerButtonSize="icon"
                  disabled={isDeleting}
                  isPending={isDeleting}
                  className="h-8 w-8 border border-gray-200 bg-white text-gray-400 hover:bg-black hover:text-white hover:border-black transition-colors rounded-none"
                />
              </div>
            </td>
          </tr>
        ))}

        {products.length === 0 && (
          <tr>
            <td colSpan={8} className="py-20 text-center">
              <Package className="h-8 w-8 text-gray-200 mx-auto mb-3" />
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                No products found
              </p>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
