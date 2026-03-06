"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Uploader } from "@/components/uploader";
import { GetCategoriesType } from "@/dal/getCategories";
import { cleanSlug } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Image as ImageIcon, Pencil, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { updateCategory } from "../actions/action";
import { updateCategorySchema } from "../schemas/schema";

export function EditCategoryButton({
  category,
}: {
  category: GetCategoriesType["data"][number];
}) {
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState(category.image?.src || "");

  const form = useForm({
    resolver: zodResolver(updateCategorySchema),
    defaultValues: {
      name: category.name || "",
      description: category.description || "",
      slug: category.slug || "",
      image: category.imageId || "",
      isActive: category.isActive || false,
    },
  });

  const handleSubmit = async (e: z.infer<typeof updateCategorySchema>) => {
    const { message, success } = await updateCategory({
      data: e,
      cId: category.id,
    });
    if (success) {
      toast.success(message);
      setOpen(false);
      form.reset();
    } else {
      toast.error(message);
    }
  };

  // ✅ Fix: extract watched value OUTSIDE useEffect to avoid infinite loop
  const watchedName = form.watch("name");
  useEffect(() => {
    form.setValue("slug", cleanSlug(watchedName));
  }, [watchedName]);

  useEffect(() => {
    form.setValue("isActive", category.isActive);
  }, [category.isActive]);

  const watchedValues = form.watch();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="h-8 w-8 border border-gray-200 bg-white hover:bg-black hover:text-white hover:border-black transition-colors rounded-none p-0"
          size="icon"
        >
          <Pencil className="h-3.5 w-3.5" />
          <span className="sr-only">Edit</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[1000px] p-0 border-0 shadow-2xl overflow-hidden bg-white rounded-none">
        <div className="flex flex-col md:flex-row h-full max-h-[90vh]">
          {/* ─── LEFT: Form ─── */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            {/* Header */}
            <div className="px-8 pt-8 pb-6 border-b border-gray-100 flex items-start justify-between">
              <div>
                <DialogTitle className="text-2xl font-black uppercase tracking-tight leading-none">
                  Update Category
                </DialogTitle>
                <DialogDescription className="text-xs text-gray-400 uppercase tracking-widest mt-1 font-bold">
                  Editing — {category.name}
                </DialogDescription>
              </div>
              <DialogClose className="text-gray-300 hover:text-black transition-colors mt-0.5">
                <X className="w-5 h-5" />
              </DialogClose>
            </div>

            {/* Form body */}
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="flex-1 overflow-y-auto"
            >
              <div className="p-8 space-y-6">
                {/* Name */}
                <Controller
                  control={form.control}
                  name="name"
                  render={({ field, fieldState }) => (
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                        Category Name
                      </label>
                      <Input
                        {...field}
                        placeholder="e.g. Traditional Food"
                        className="h-11 border border-gray-300 rounded-none focus-visible:ring-0 focus-visible:border-black text-sm font-bold px-3 bg-white"
                      />
                      {fieldState.error && (
                        <p className="text-red-500 text-xs font-bold">
                          {fieldState.error.message}
                        </p>
                      )}
                    </div>
                  )}
                />

                {/* Slug + Status */}
                <div className="grid grid-cols-2 gap-6">
                  <Controller
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                          URL Slug
                        </label>
                        <div className="h-11 flex items-center border border-gray-200 bg-gray-50 px-3 gap-0.5">
                          <span className="text-gray-400 font-mono text-sm">
                            /
                          </span>
                          <span className="font-mono text-sm text-gray-500">
                            {field.value || "auto-generated"}
                          </span>
                        </div>
                      </div>
                    )}
                  />

                  <Controller
                    control={form.control}
                    name="isActive"
                    render={({ field: { value, onChange } }) => (
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                          Status
                        </label>
                        <button
                          type="button"
                          onClick={() => onChange(!value)}
                          className={`h-11 w-full flex items-center gap-3 px-4 border transition-all ${
                            value
                              ? "border-black bg-black text-white"
                              : "border-gray-300 bg-white text-gray-500"
                          }`}
                        >
                          <div
                            className={`w-4 h-4 border-2 flex items-center justify-center shrink-0 ${
                              value
                                ? "border-white bg-white"
                                : "border-gray-400 bg-white"
                            }`}
                          >
                            {value && <div className="w-2 h-2 bg-black" />}
                          </div>
                          <div className="text-left">
                            <div className="text-xs font-black uppercase tracking-widest">
                              {value ? "Active" : "Draft"}
                            </div>
                            <div
                              className={`text-[9px] font-bold uppercase tracking-widest ${value ? "text-gray-300" : "text-gray-400"}`}
                            >
                              {value ? "Publicly Visible" : "Hidden"}
                            </div>
                          </div>
                        </button>
                      </div>
                    )}
                  />
                </div>

                {/* Description */}
                <Controller
                  control={form.control}
                  name="description"
                  render={({ field, fieldState }) => (
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                        Description
                      </label>
                      <Textarea
                        {...field}
                        placeholder="Describe what items belong in this category..."
                        className="min-h-[100px] border border-gray-300 rounded-none focus-visible:ring-0 focus-visible:border-black resize-none text-sm px-3 py-2.5 bg-white font-bold"
                      />
                      {fieldState.error && (
                        <p className="text-red-500 text-xs font-bold">
                          {fieldState.error.message}
                        </p>
                      )}
                    </div>
                  )}
                />

                {/* Image */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                    Category Image
                  </label>
                  <Controller
                    control={form.control}
                    name="image"
                    render={({ field: { onChange } }) => (
                      <div className="border border-dashed border-gray-300 bg-gray-50 p-6 flex flex-col items-center gap-3">
                        <Uploader
                          images={category.image ? [category.image] : []}
                          onChange={(e) => {
                            if (e.length > 0) {
                              setImage(e[0].placeholder!);
                              onChange(e[0].id);
                            }
                            if (e.length === 0) {
                              setImage("");
                              onChange("");
                            }
                          }}
                          maxFiles={1}
                          isEditMode={true}
                          disabled={form.formState.isSubmitting}
                        />
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                          PNG, JPG or GIF · Max 5MB
                        </p>
                      </div>
                    )}
                  />
                </div>
              </div>

              {/* Footer actions */}
              <div className="px-8 py-5 border-t border-gray-100 flex gap-3 bg-white sticky bottom-0">
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 h-11 font-bold text-xs uppercase tracking-widest border border-gray-300 bg-white text-black hover:bg-gray-50 rounded-none"
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  onClick={form.handleSubmit(handleSubmit)}
                  disabled={form.formState.isSubmitting}
                  className="flex-1 h-11 font-black text-xs uppercase tracking-widest bg-black text-white hover:bg-gray-800 rounded-none"
                >
                  {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>

          {/* ─── RIGHT: Live Preview ─── */}
          <div className="hidden md:flex w-[340px] bg-gray-50 border-l border-gray-100 flex-col overflow-hidden shrink-0">
            <div className="px-6 py-5 border-b border-gray-100">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                Live Preview
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Category card preview */}
              <div className="bg-white border border-gray-200 overflow-hidden">
                <div className="aspect-4/3 bg-gray-100 relative overflow-hidden flex items-center justify-center">
                  {watchedValues.image && image ? (
                    <img
                      src={image}
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
                <div className="p-4 space-y-1.5">
                  <h3 className="font-black text-base uppercase tracking-tight leading-tight">
                    {watchedValues.name || "Category Name"}
                  </h3>
                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                    {watchedValues.description ||
                      "Category description will appear here once you start typing."}
                  </p>
                  <div className="pt-2">
                    <span className="font-mono text-[9px] text-gray-400 bg-gray-100 px-1.5 py-0.5">
                      /{watchedValues.slug || "slug"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Meta */}
              <div className="space-y-2">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">
                  Metadata
                </p>
                <div className="space-y-0">
                  {[
                    { label: "Name", value: watchedValues.name || "—" },
                    { label: "Slug", value: `/${watchedValues.slug || "—"}` },
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
                      <span className="text-xs font-bold truncate max-w-[150px]">
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
