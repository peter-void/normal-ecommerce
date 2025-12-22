"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { motion, Variants } from "framer-motion";
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
        "Failed to " + (isEditMode ? "update" : "create") + " product"
      );
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  const inputStyles =
    "h-12 border-2 border-border focus-visible:ring-0 focus-visible:border-main shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-base bg-white transition-all hover:bg-zinc-50";

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={isDialogMode ? "" : "max-w-7xl mx-auto py-8"}
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div
          className={
            isDialogMode ? "space-y-8" : "grid grid-cols-1 lg:grid-cols-3 gap-8"
          }
        >
          <div
            className={isDialogMode ? "space-y-8" : "lg:col-span-2 space-y-8"}
          >
            <motion.div variants={itemVariants} className="space-y-6">
              <FieldGroup className="gap-6">
                <Controller
                  control={form.control}
                  name="name"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel
                        htmlFor={field.name}
                        className="font-heading text-lg"
                      >
                        Product Name
                      </FieldLabel>
                      <Input
                        id={field.name}
                        {...field}
                        placeholder="e.g. Premium Sate Kambing"
                        className={inputStyles}
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.error && (
                        <FieldError
                          className="text-red-600 font-bold mt-1"
                          errors={[fieldState.error]}
                        />
                      )}
                    </Field>
                  )}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Controller
                    control={form.control}
                    name="slug"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel
                          htmlFor={field.name}
                          className="font-heading text-lg"
                        >
                          URL Slug
                        </FieldLabel>
                        <Input
                          {...field}
                          className="h-12 border-2 border-border bg-zinc-50 italic pointer-events-none opacity-80 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                          disabled
                        />
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
                          className="font-heading text-lg"
                        >
                          Category
                        </FieldLabel>
                        <Select {...field} onValueChange={onChange}>
                          <SelectTrigger
                            onBlur={onBlur}
                            className={inputStyles}
                          >
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent className="border-2 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {fieldState.error && (
                          <FieldError
                            className="text-red-600 font-bold mt-1"
                            errors={[fieldState.error]}
                          />
                        )}
                      </Field>
                    )}
                  />
                </div>

                <Controller
                  control={form.control}
                  name="description"
                  render={({ field: { value, ...field }, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel
                        htmlFor={field.name}
                        className="font-heading text-lg"
                      >
                        Description
                      </FieldLabel>
                      <Textarea
                        id={field.name}
                        {...field}
                        value={value ?? ""}
                        placeholder="Share a succulent story about this product..."
                        aria-invalid={fieldState.invalid}
                        rows={5}
                        className="resize-none border-2 border-border focus-visible:ring-0 focus-visible:border-main shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 text-base"
                      />
                      {fieldState.error && (
                        <FieldError
                          className="text-red-600 font-bold mt-1"
                          errors={[fieldState.error]}
                        />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-4">
              <FieldLabel className="font-heading text-lg">
                Product Media
              </FieldLabel>
              <div className="border-4 border-dashed border-border rounded-xl p-6 bg-zinc-50/50">
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
                          className="text-red-600 font-bold mt-2"
                          errors={[fieldState.error]}
                        />
                      )}
                    </Field>
                  )}
                />
              </div>
            </motion.div>
          </div>

          <div
            className={
              isDialogMode
                ? "grid grid-cols-1 md:grid-cols-2 gap-8"
                : "space-y-8"
            }
          >
            <motion.div variants={itemVariants} className="space-y-6">
              <Controller
                control={form.control}
                name="price"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor={field.name}
                      className="font-heading text-lg"
                    >
                      Listing Price (Rp)
                    </FieldLabel>
                    <Input
                      id={field.name}
                      type="text"
                      inputMode="numeric"
                      value={formatRupiah(field.value)}
                      onChange={(e) =>
                        field.onChange(parseRupiah(e.target.value))
                      }
                      className={inputStyles}
                      aria-invalid={fieldState.invalid}
                    />
                  </Field>
                )}
              />

              <div className="grid grid-cols-2 gap-6">
                <Controller
                  control={form.control}
                  name="stock"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel
                        htmlFor={field.name}
                        className="font-heading text-lg"
                      >
                        Initial Stock
                      </FieldLabel>
                      <Input
                        type="number"
                        min={0}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        value={field.value}
                        className={inputStyles}
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
                        className="font-heading text-lg"
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
                        className={inputStyles}
                      />
                    </Field>
                  )}
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-6">
              <Controller
                control={form.control}
                name="isFeatured"
                render={({ field: { value, onChange, ...field } }) => (
                  <div
                    className={`flex items-center justify-between p-4 border-2 border-border rounded-xl cursor-pointer transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
                      value ? "bg-yellow-400/20" : "bg-zinc-50"
                    }`}
                  >
                    <div className="space-y-0.5">
                      <label className="font-heading text-lg cursor-pointer select-none">
                        Featured Product
                      </label>
                      <p className="text-xs text-muted-foreground uppercase font-bold tracking-tight">
                        Highlight on homepage
                      </p>
                    </div>
                    <Checkbox
                      checked={value}
                      onCheckedChange={onChange}
                      className="h-7 w-7 border-2 border-border data-[state=checked]:bg-main data-[state=checked]:text-black shadow-none"
                    />
                  </div>
                )}
              />

              <Controller
                control={form.control}
                name="isActive"
                render={({ field: { value, onChange } }) => (
                  <div
                    className={`flex items-center justify-between p-4 border-2 border-border rounded-xl cursor-pointer transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
                      value ? "bg-main/10" : "bg-zinc-50"
                    }`}
                  >
                    <div className="space-y-0.5">
                      <label className="font-heading text-lg cursor-pointer select-none">
                        Active Listing
                      </label>
                      <p className="text-xs text-muted-foreground uppercase font-bold tracking-tight">
                        Show to Customers
                      </p>
                    </div>
                    <Checkbox
                      checked={value}
                      onCheckedChange={onChange}
                      className="h-7 w-7 border-2 border-border data-[state=checked]:bg-main data-[state=checked]:text-black shadow-none"
                    />
                  </div>
                )}
              />

              {!isDialogMode && (
                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-16 text-xl font-heading border-2 border-border shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all active:translate-x-[4px] active:translate-y-[4px]"
                  disabled={form.formState.isSubmitting}
                >
                  {isEditMode ? "COMMIT UPDATES" : "GENERATE PRODUCT"}
                </Button>
              )}
            </motion.div>
          </div>
        </div>

        {isDialogMode && (
          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              className="flex-1 h-16 text-xl font-heading border-2 border-border shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all active:translate-x-[4px] active:translate-y-[4px]"
              disabled={form.formState.isSubmitting}
            >
              {isEditMode ? "COMMIT UPDATES" : "GENERATE PRODUCT"}
            </Button>
          </div>
        )}
      </form>
    </motion.div>
  );
}
