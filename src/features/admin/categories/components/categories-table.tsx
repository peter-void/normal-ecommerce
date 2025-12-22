"use client";

import { AlertDialogActionButton } from "@/components/alert-dialog-action-button";
import { Badge } from "@/components/ui/badge";
import { Category } from "@/generated/prisma/client";
import { Trash2, Image as ImageIcon, Calendar } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { deleteCategory } from "../actions/action";
import { EditCategoryButton } from "./edit-category-button";

export function CategoriesTable({
  categories,
  skip,
}: {
  categories: Category[];
  skip: number;
}) {
  const [isDeleting, startDeleting] = useTransition();

  const handleDeleteCategory = async (cID: string) => {
    startDeleting(async () => {
      const { success, message } = await deleteCategory({ id: cID });

      if (!success) {
        toast.error(message);
      } else {
        toast.success(message);
      }
    });
  };

  return (
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="bg-main text-main-foreground font-heading">
          <th className="p-5 border-b-2 border-border first:rounded-tl-xl truncate">
            #
          </th>
          <th className="p-5 border-b-2 border-border min-w-[200px]">Name</th>
          <th className="p-5 border-b-2 border-border">Slug</th>
          <th className="p-5 border-b-2 border-border min-w-[250px]">
            Description
          </th>
          <th className="p-5 border-b-2 border-border">Status</th>
          <th className="p-5 border-b-2 border-border text-right last:rounded-tr-xl">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="bg-secondary-background">
        {categories.map((category, i) => (
          <tr
            key={category.id}
            className="group border-b-2 border-border last:border-0 hover:bg-main/5 transition-colors"
          >
            <td className="p-5 align-top">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-base border-2 border-border bg-white font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                {i + skip + 1}
              </span>
            </td>
            <td className="p-5 align-top">
              <div className="flex items-start gap-4">
                <div className="relative w-16 h-16 shrink-0 rounded-base border-2 border-border bg-white overflow-hidden shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center group-hover:scale-105 transition-transform">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-muted-foreground/30" />
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-heading text-xl leading-tight">
                    {category.name}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {category.createdAt.toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </td>
            <td className="p-5 align-top">
              <Badge
                variant="neutral"
                className="font-mono text-[10px] uppercase tracking-tighter shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] border-2"
              >
                {category.slug}
              </Badge>
            </td>
            <td className="p-5 align-top max-w-[300px]">
              <p className="text-sm text-muted-foreground line-clamp-3 italic">
                {category.description || "No description provided."}
              </p>
            </td>
            <td className="p-5 align-top">
              <Badge
                variant={category.isActive ? "default" : "neutral"}
                className={`shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] border-2 font-bold px-3 py-1 ${
                  category.isActive
                    ? "bg-green-400 text-black"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {category.isActive ? "ACTIVE" : "INACTIVE"}
              </Badge>
            </td>

            <td className="p-5 text-right align-top">
              <div className="flex justify-end gap-3">
                <EditCategoryButton category={category} />
                <AlertDialogActionButton
                  action={() => handleDeleteCategory(category.id)}
                  buttonContent={
                    <>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </>
                  }
                  dialogTitle="Delete Category"
                  dialogDescription={`Are you sure you want to delete "${category.name}"? This action cannot be undone.`}
                  triggerButtonSize="icon"
                  disabled={isDeleting}
                  isPending={isDeleting}
                  className="h-10 w-10 border-2 border-border bg-white hover:bg-red-400 hover:text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
