"use client";

import { AlertDialogActionButton } from "@/components/alert-dialog-action-button";
import { GetCategoriesType } from "@/dal/getCategories";
import { Image as ImageIcon, Package, Trash2 } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { deleteCategory } from "../actions/action";
import { EditCategoryButton } from "./edit-category-button";
import { cn } from "@/lib/utils";

export function CategoriesTable({
  categories,
  skip,
}: {
  categories: GetCategoriesType["data"];
  skip: number;
}) {
  const [isDeleting, startDeleting] = useTransition();

  const handleDeleteCategory = async (cID: string) => {
    startDeleting(async () => {
      const { success, message } = await deleteCategory({ id: cID });
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
            Category
          </th>
          <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-500 w-36">
            Slug
          </th>
          <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-500">
            Description
          </th>
          <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-500 w-24 text-center">
            Status
          </th>
          <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-500 w-28 text-center">
            Products
          </th>
          <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-500 w-24 text-right">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-100">
        {categories.map((category, i) => (
          <tr
            key={category.id}
            className="group hover:bg-gray-50 transition-colors"
          >
            {/* # */}
            <td className="px-5 py-4 text-center">
              <span className="text-xs font-bold text-gray-400">
                {i + skip + 1}
              </span>
            </td>

            {/* Category */}
            <td className="px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 shrink-0 border border-gray-100 bg-gray-50 overflow-hidden flex items-center justify-center">
                  {category.imageId ? (
                    <img
                      src={category.image?.src}
                      alt={category.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="h-4 w-4 text-gray-300" />
                  )}
                </div>
                <div>
                  <p className="font-bold text-sm">{category.name}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {category.createdAt.toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </td>

            {/* Slug */}
            <td className="px-5 py-4">
              <span className="font-mono text-[10px] text-gray-500 bg-gray-100 px-2 py-1">
                {category.slug}
              </span>
            </td>

            {/* Description */}
            <td className="px-5 py-4 max-w-[240px]">
              <p className="text-xs text-gray-500 line-clamp-2">
                {category.description || (
                  <span className="text-gray-300 italic">No description</span>
                )}
              </p>
            </td>

            {/* Status */}
            <td className="px-5 py-4 text-center">
              <span
                className={cn(
                  "text-[10px] font-bold uppercase tracking-widest px-2.5 py-1",
                  category.isActive
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-500",
                )}
              >
                {category.isActive ? "Active" : "Inactive"}
              </span>
            </td>

            {/* Products count */}
            <td className="px-5 py-4 text-center">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600">
                <Package className="h-3.5 w-3.5 text-gray-400" />
                {category.products.length}
              </div>
            </td>

            {/* Actions */}
            <td className="px-5 py-4 text-right">
              <div className="flex justify-end gap-2">
                <EditCategoryButton category={category} />
                <AlertDialogActionButton
                  action={() => handleDeleteCategory(category.id)}
                  buttonContent={
                    <>
                      <Trash2 className="h-3.5 w-3.5" />
                      <span className="sr-only">Delete</span>
                    </>
                  }
                  dialogTitle="Delete Category"
                  dialogDescription={`Are you sure you want to delete "${category.name}"? This action cannot be undone.`}
                  triggerButtonSize="icon"
                  disabled={isDeleting || category.products.length > 0}
                  isPending={isDeleting}
                  className="h-8 w-8 border border-gray-200 bg-white text-gray-400 hover:bg-black hover:text-white hover:border-black transition-colors rounded-none"
                />
              </div>
            </td>
          </tr>
        ))}

        {categories.length === 0 && (
          <tr>
            <td colSpan={7} className="py-20 text-center">
              <Package className="h-8 w-8 text-gray-200 mx-auto mb-3" />
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                No categories found
              </p>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
