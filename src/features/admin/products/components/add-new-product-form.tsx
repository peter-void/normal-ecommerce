"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldLabel,
  FieldGroup,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Uploader } from "@/components/uploader";
import { Category } from "@/generated/prisma/client";
import { formatRupiah, parseRupiah } from "@/lib/format";
import {
  cleanSlug,
  generatePublicImageURL,
  parseNumberInput,
} from "@/lib/utils";
import { ProductEditProps } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { createProduct, updateProduct } from "../actions/action";
import { CreateProductSchema, createProductSchema } from "../schemas/schema";
import { useRouter } from "next/navigation";
import { DEFAULT_MAX_FILES } from "@/constants";

interface AddNewProductFormProps {
  categories: Category[];
  product?: ProductEditProps["product"];
  isEditMode?: boolean;
  onValuesChange?: (values: any) => void;
  onSuccess?: () => void;
  isDialogMode?: boolean;
}

export function AddNewProductForm({
  categories,
  product,
  isEditMode = false,
  onValuesChange,
  onSuccess,
  isDialogMode = false,
}: AddNewProductFormProps) {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      categoryId: product?.categoryId || "",
      isActive: product?.isActive ?? true,
      stock: Number(product?.stock) || 0,
      price: Number(product?.price) || 0,
      weight: Number(product?.weight) || null,
      description: product?.description || "",
      image:
        product?.images.map((image) => ({
          id: image.id,
          key: image.key,
          src: generatePublicImageURL(image.key),
          alt: image.id,
        })) || [],
      slug: product?.slug || "",
      name: product?.name || "",
      isFeatured: product?.isFeatured ?? false,
    },
  });

  const watchedValues = form.watch();

  useEffect(() => {
    if (onValuesChange) {
      onValuesChange({
        ...watchedValues,
        image: watchedValues.image.map((img) => ({
          id: img.id,
          key: img.key,
          src: generatePublicImageURL(img.key),
          alt: img.id,
        })),
      });
    }
  }, [watchedValues, onValuesChange]);

  useEffect(() => {
    form.setValue("slug", cleanSlug(watchedValues.name));
  }, [watchedValues.name]);

  const onSubmit = async (data: CreateProductSchema) => {
    try {
      const response = isEditMode
        ? await updateProduct(data, product?.id!)
        : await createProduct(data);

      if (response.success) {
        if (onSuccess) {
          onSuccess();
        } else {
          router.push("/admin/products");
        }
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(
        "Failed to " + (isEditMode ? "update" : "create") + " product",
      );
    }
  };

  // ─── Shared input style: full black border, padded ───
  const inputBase =
    "h-11 border border-gray-300 focus-visible:border-black rounded-none focus-visible:ring-0 text-sm font-bold px-3 bg-white shadow-none transition-colors";

  return (
    <div className={isDialogMode ? "" : "max-w-7xl mx-auto py-8"}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div
          className={
            isDialogMode ? "space-y-6" : "grid grid-cols-1 lg:grid-cols-3 gap-8"
          }
        >
          {/* ─── Primary fields ─── */}
          <div
            className={isDialogMode ? "space-y-6" : "lg:col-span-2 space-y-6"}
          >
            <FieldGroup className="gap-6">
              {/* Name */}
              <Controller
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor={field.name}
                      className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500"
                    >
                      Product Name
                    </FieldLabel>
                    <Input
                      id={field.name}
                      {...field}
                      placeholder="e.g. Premium Sate Kambing"
                      className={inputBase}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.error && (
                      <FieldError
                        className="text-red-500 text-xs font-bold mt-1"
                        errors={[fieldState.error]}
                      />
                    )}
                  </Field>
                )}
              />

              {/* Slug + Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Controller
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <Field>
                      <FieldLabel
                        htmlFor={field.name}
                        className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500"
                      >
                        URL Slug
                      </FieldLabel>
                      <div className="h-11 flex items-center border border-gray-200 bg-gray-50 px-3 gap-0.5">
                        <span className="text-gray-400 font-mono text-sm">
                          /
                        </span>
                        <span className="font-mono text-sm text-gray-500">
                          {field.value || "auto-generated"}
                        </span>
                      </div>
                    </Field>
                  )}
                />

                <Controller
                  control={form.control}
                  name="categoryId"
                  render={({
                    field: { onChange, onBlur, ...field },
                    fieldState,
                  }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel
                        htmlFor={field.name}
                        className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500"
                      >
                        Category
                      </FieldLabel>
                      <Select {...field} onValueChange={onChange}>
                        <SelectTrigger
                          onBlur={onBlur}
                          className="h-11 border border-gray-300 focus:border-black focus-visible:ring-0 rounded-none text-sm font-bold px-3 bg-white shadow-none"
                        >
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent className="border border-gray-200 shadow-md rounded-none bg-white text-black">
                          {categories.map((category) => (
                            <SelectItem
                              key={category.id}
                              value={category.id}
                              className="text-sm font-bold text-black"
                            >
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {fieldState.error && (
                        <FieldError
                          className="text-red-500 text-xs font-bold mt-1"
                          errors={[fieldState.error]}
                        />
                      )}
                    </Field>
                  )}
                />
              </div>

              {/* Description */}
              <Controller
                control={form.control}
                name="description"
                render={({ field: { value, ...field }, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor={field.name}
                      className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500"
                    >
                      Description
                    </FieldLabel>
                    <Textarea
                      id={field.name}
                      {...field}
                      value={value ?? ""}
                      placeholder="Share a succinct description of this product..."
                      aria-invalid={fieldState.invalid}
                      rows={4}
                      className="border border-gray-300 focus-visible:border-black focus-visible:ring-0 resize-none text-sm px-3 py-2.5 bg-white shadow-none rounded-none font-bold"
                    />
                    {fieldState.error && (
                      <FieldError
                        className="text-red-500 text-xs font-bold mt-1"
                        errors={[fieldState.error]}
                      />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            {/* Product Media */}
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                Product Images
              </p>
              <div className="border border-dashed border-gray-300 bg-gray-50 p-6 flex flex-col items-center gap-3">
                <Controller
                  control={form.control}
                  name="image"
                  render={({ field: { value, onChange }, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <Uploader
                        maxFiles={DEFAULT_MAX_FILES}
                        onChange={onChange}
                        disabled={form.formState.isSubmitting}
                        isEditMode={isEditMode}
                        images={product?.images ?? []}
                      />
                      {fieldState.error && (
                        <FieldError
                          className="text-red-500 text-xs font-bold mt-2"
                          errors={[fieldState.error]}
                        />
                      )}
                    </Field>
                  )}
                />
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                  PNG, JPG or GIF · Max 5MB each
                </p>
              </div>
            </div>
          </div>

          {/* ─── Side fields: Price, Stock, Weight, Toggles ─── */}
          <div
            className={
              isDialogMode
                ? "grid grid-cols-1 md:grid-cols-2 gap-6"
                : "space-y-6"
            }
          >
            {/* Price */}
            <Controller
              control={form.control}
              name="price"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor={field.name}
                    className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500"
                  >
                    Price (Rp)
                  </FieldLabel>
                  <Input
                    id={field.name}
                    type="text"
                    inputMode="numeric"
                    value={formatRupiah(field.value)}
                    onChange={(e) =>
                      field.onChange(parseRupiah(e.target.value))
                    }
                    className={inputBase}
                    aria-invalid={fieldState.invalid}
                  />
                </Field>
              )}
            />

            {/* Stock + Weight */}
            <div className="grid grid-cols-2 gap-4">
              <Controller
                control={form.control}
                name="stock"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor={field.name}
                      className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500"
                    >
                      Stock
                    </FieldLabel>
                    <Input
                      type="number"
                      min={0}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      value={field.value}
                      className={inputBase}
                    />
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="weight"
                render={({
                  field: { value, onChange, ...field },
                  fieldState,
                }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor={field.name}
                      className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500"
                    >
                      Weight (g)
                    </FieldLabel>
                    <Input
                      {...field}
                      value={value ?? ""}
                      onChange={(e) =>
                        onChange(parseNumberInput(e.target.value))
                      }
                      inputMode="decimal"
                      className={inputBase}
                    />
                  </Field>
                )}
              />
            </div>

            {/* Featured toggle */}
            <Controller
              control={form.control}
              name="isFeatured"
              render={({ field: { value, onChange } }) => (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                    Featured
                  </label>
                  <button
                    type="button"
                    onClick={() => onChange(!value)}
                    className={`h-12 w-full flex items-center gap-3 px-4 border transition-all ${
                      value
                        ? "border-black bg-black text-white"
                        : "border-gray-200 bg-gray-50 text-gray-500"
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
                        {value ? "Featured" : "Not Featured"}
                      </div>
                      <div
                        className={`text-[9px] font-bold uppercase tracking-widest ${value ? "text-gray-300" : "text-gray-400"}`}
                      >
                        {value ? "Shown on Homepage" : "Standard Listing"}
                      </div>
                    </div>
                  </button>
                </div>
              )}
            />

            {/* Active toggle */}
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
                    className={`h-12 w-full flex items-center gap-3 px-4 border transition-all ${
                      value
                        ? "border-black bg-black text-white"
                        : "border-gray-200 bg-gray-50 text-gray-500"
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
                        {value ? "Publicly Visible" : "Hidden from Store"}
                      </div>
                    </div>
                  </button>
                </div>
              )}
            />

            {/* Standalone submit (non-dialog mode) */}
            {!isDialogMode && (
              <Button
                type="submit"
                className="w-full h-11 font-black text-xs uppercase tracking-widest bg-black text-white hover:bg-gray-800 rounded-none transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                disabled={
                  form.formState.isSubmitting ||
                  (isEditMode && !form.formState.isDirty)
                }
              >
                {isEditMode ? "Save Changes" : "Create Product"}
              </Button>
            )}
          </div>
        </div>

        {/* Dialog submit footer */}
        {isDialogMode && (
          <div className="flex gap-3 pt-2 border-t border-gray-100">
            <Button
              type="submit"
              className="flex-1 h-11 font-black text-xs uppercase tracking-widest bg-black text-white hover:bg-gray-800 rounded-none transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              disabled={
                form.formState.isSubmitting ||
                (isEditMode && !form.formState.isDirty)
              }
            >
              {form.formState.isSubmitting
                ? "Saving..."
                : isEditMode
                  ? "Save Changes"
                  : "Create Product"}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
