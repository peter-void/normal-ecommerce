"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Category } from "@/generated/prisma/client";
import { cleanSlug } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Image as ImageIcon, Calendar, Settings2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { updateCategory } from "../actions/action";
import { updateCategorySchema } from "../schemas/schema";
import { Badge } from "@/components/ui/badge";

export function EditCategoryButton({ category }: { category: Category }) {
  const [open, setOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(updateCategorySchema),
    defaultValues: {
      name: category.name || "",
      description: category.description || "",
      slug: category.slug || "",
      image: category.image || "",
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

  useEffect(() => {
    form.setValue("slug", cleanSlug(form.watch("name")));
  }, [form.watch("name")]);

  useEffect(() => {
    form.setValue("isActive", category.isActive);
  }, [category.isActive]);

  const watchedValues = form.watch();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-10 w-10 border-2 border-border bg-white hover:bg-main hover:text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none p-0">
          <Pencil className="h-4 w-4" />
          <span className="sr-only">Edit</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[900px] p-0 border-4 border-border shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden bg-secondary-background">
        <div className="flex flex-col md:flex-row h-full min-h-[600px]">
          {/* Left Side: Form */}
          <div className="flex-1 flex flex-col border-r-4 border-border bg-white">
            <DialogHeader className="bg-main p-8 border-b-4 border-border">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white rounded-base border-2 border-border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <Settings2 className="w-5 h-5 text-main" />
                </div>
                <DialogTitle className="text-3xl font-heading text-main-foreground">
                  Update Category
                </DialogTitle>
              </div>
              <DialogDescription className="text-main-foreground/90 font-base text-lg">
                Refine the details of your category below.
              </DialogDescription>
            </DialogHeader>

            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="p-8 space-y-8 flex-1 overflow-y-auto"
            >
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
                        Category Name
                      </FieldLabel>
                      <Input
                        id={field.name}
                        {...field}
                        placeholder="e.g. Traditional Food"
                        className="h-12 border-2 border-border focus-visible:ring-0 focus-visible:border-main shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-lg"
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError
                          className="text-red-600 font-bold mt-1"
                          errors={[fieldState.error]}
                        />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  control={form.control}
                  name="description"
                  render={({ field, fieldState }) => (
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
                        placeholder="Share a brief story or list what's inside this category..."
                        aria-invalid={fieldState.invalid}
                        className="min-h-[140px] border-2 border-border focus-visible:ring-0 focus-visible:border-main shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] resize-none text-base p-4"
                      />
                      {fieldState.invalid && (
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
                          className="h-12 border-2 border-border bg-gray-50 italic pointer-events-none opacity-80 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                          disabled
                        />
                      </Field>
                    )}
                  />

                  <Controller
                    control={form.control}
                    name="isActive"
                    render={({
                      field: { value, onChange, ...field },
                      fieldState,
                    }) => (
                      <div
                        onClick={() => onChange(!value)}
                        className={`flex items-center gap-3 p-3 border-2 border-border rounded-base cursor-pointer transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
                          value ? "bg-main/10" : "bg-gray-50"
                        }`}
                      >
                        <Checkbox
                          {...field}
                          id={field.name}
                          checked={value}
                          onCheckedChange={onChange}
                          className="h-6 w-6 border-2 border-border data-[state=checked]:bg-main data-[state=checked]:text-main-foreground shadow-none"
                        />
                        <div className="grid gap-0.5 leading-none">
                          <label className="font-heading text-base cursor-pointer select-none">
                            Active Status
                          </label>
                          <p className="text-[10px] text-muted-foreground uppercase font-bold">
                            {value ? "Publicly Visible" : "Hidden from Store"}
                          </p>
                        </div>
                      </div>
                    )}
                  />
                </div>
              </FieldGroup>
            </form>

            <div className="p-8 pt-4 border-t-2 border-border flex gap-4 bg-secondary-background/30">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="neutral"
                  className="flex-1 h-14 font-heading text-lg border-2 border-border bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-orange-50 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                >
                  CANCEL
                </Button>
              </DialogClose>
              <Button
                onClick={form.handleSubmit(handleSubmit)}
                disabled={form.formState.isSubmitting}
                className="flex-[2] h-14 font-heading text-lg border-2 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all active:translate-x-[4px] active:translate-y-[4px]"
              >
                {form.formState.isSubmitting ? "SAVING..." : "COMMIT CHANGES"}
              </Button>
            </div>
          </div>

          {/* Right Side: Visual Preview */}
          <div className="hidden md:flex w-[350px] bg-secondary-background flex-col items-center justify-center p-8 text-center relative overflow-hidden">
            {/* Background Decorative Element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-main/20 -mr-12 -mt-12 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-main/10 -ml-24 -mb-24 rounded-full blur-3xl" />

            <div className="relative z-10 w-full space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  Category Preview
                </span>
                <div className="h-1 w-12 bg-main mx-auto border border-border" />
              </div>

              {/* Mock Category Card */}
              <div className="w-full bg-white border-2 border-border rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden transition-transform hover:rotate-1">
                <div className="h-40 bg-gray-100 flex items-center justify-center border-b-2 border-border relative">
                  {watchedValues.image ? (
                    <img
                      src={watchedValues.image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground/40">
                      <ImageIcon className="w-12 h-12" />
                      <span className="text-xs font-heading">
                        Current Image
                      </span>
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <Badge
                      className={`border-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                        watchedValues.isActive
                          ? "bg-green-400 text-black"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {watchedValues.isActive ? "ACTIVE" : "DRAFT"}
                    </Badge>
                  </div>
                </div>
                <div className="p-5 text-left space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-main/80 uppercase">
                    <Calendar className="w-3 h-3" />
                    Updated Today
                  </div>
                  <h4 className="font-heading text-2xl truncate">
                    {watchedValues.name || "Untitled Category"}
                  </h4>
                  <p className="text-xs text-muted-foreground line-clamp-2 italic leading-relaxed">
                    {watchedValues.description || "Describe this category..."}
                  </p>
                  <div className="pt-2">
                    <Badge
                      variant="neutral"
                      className="text-[10px] border-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-colors"
                    >
                      /{watchedValues.slug || "slug-preview"}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="bg-white/50 backdrop-blur-sm border-2 border-dashed border-border p-4 rounded-base">
                <p className="text-xs font-base text-muted-foreground leading-relaxed">
                  Real-time preview of your changes. Ensure the name and
                  description are engaging!
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
