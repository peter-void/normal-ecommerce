"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  Calendar,
  Image as ImageIcon,
  Pencil,
  Sparkles,
  X,
} from "lucide-react";
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

      <DialogContent className="sm:max-w-[1100px] p-0 border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden bg-white">
        <div className="flex flex-col md:flex-row h-full max-h-[90vh]">
          {/* Left Side: Form */}
          <div className="flex-1 flex flex-col min-w-0 bg-white">
            <DialogHeader className="bg-main p-8 border-b-4 border-black relative text-left">
              <DialogClose className="absolute right-6 top-6 text-main-foreground/60 hover:text-main-foreground transition-colors">
                <X className="w-6 h-6" />
              </DialogClose>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  <Sparkles className="w-6 h-6 text-main" />
                </div>
                <div>
                  <DialogTitle className="text-3xl font-black uppercase tracking-tight text-main-foreground">
                    Update Category
                  </DialogTitle>
                  <DialogDescription className="text-main-foreground/80 font-bold mt-1 text-base">
                    Refine the details of your category below.
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="p-8 space-y-10 overflow-y-auto flex-1 custom-scrollbar"
            >
              <div className="space-y-8">
                {/* Name Field */}
                <Controller
                  control={form.control}
                  name="name"
                  render={({ field, fieldState }) => (
                    <div className="space-y-3">
                      <label className="font-black uppercase tracking-wider text-sm">
                        Category Name
                      </label>
                      <Input
                        {...field}
                        placeholder="e.g. Traditional Food"
                        className="h-14 border-4 border-black focus-visible:ring-0 focus-visible:border-main shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-lg font-bold"
                      />
                      {fieldState.error && (
                        <p className="text-red-500 font-black text-xs uppercase italic">
                          {fieldState.error.message}
                        </p>
                      )}
                    </div>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Slug Field */}
                  <Controller
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <div className="space-y-3">
                        <label className="font-black uppercase tracking-wider text-sm">
                          URL Slug
                        </label>
                        <Input
                          {...field}
                          className="h-14 border-4 border-black bg-gray-100 italic pointer-events-none opacity-80 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold text-muted-foreground"
                          disabled
                        />
                      </div>
                    )}
                  />

                  {/* Status Field */}
                  <Controller
                    control={form.control}
                    name="isActive"
                    render={({ field: { value, onChange } }) => (
                      <div className="space-y-3">
                        <label className="font-black uppercase tracking-wider text-sm">
                          Active Status
                        </label>
                        <div
                          onClick={() => onChange(!value)}
                          className={`flex items-center gap-4 h-14 px-5 border-4 border-black cursor-pointer transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
                            value ? "bg-main/10" : "bg-gray-100"
                          }`}
                        >
                          <Checkbox
                            checked={value}
                            onCheckedChange={onChange}
                            className="h-7 w-7 border-4 border-black data-[state=checked]:bg-main data-[state=checked]:text-main-foreground shadow-none"
                          />
                          <div className="flex flex-col leading-none">
                            <span className="font-black text-base uppercase">
                              {value ? "Active" : "Draft"}
                            </span>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase">
                              {value ? "Publicly Visible" : "Hidden from Store"}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  />
                </div>

                <Controller
                  control={form.control}
                  name="description"
                  render={({ field, fieldState }) => (
                    <div className="space-y-3">
                      <label className="font-black uppercase tracking-wider text-sm">
                        Description
                      </label>
                      <Textarea
                        {...field}
                        placeholder="Share a brief story or list what's inside this category..."
                        className="min-h-[160px] border-4 border-black focus-visible:ring-0 focus-visible:border-main shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] resize-none text-base font-bold p-5"
                      />
                      {fieldState.error && (
                        <p className="text-red-500 font-black text-xs uppercase italic">
                          {fieldState.error.message}
                        </p>
                      )}
                    </div>
                  )}
                />

                <div className="space-y-3">
                  <label className="font-black uppercase tracking-wider text-sm">
                    Category Media
                  </label>
                  <Controller
                    control={form.control}
                    name="image"
                    render={({ field: { onChange } }) => (
                      <div className="p-1">
                        <div className="bg-gray-50 p-8 border-4 border-black flex flex-col items-center justify-center gap-4">
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
                          <p className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter">
                            SVG, PNG, JPG or GIF (max. 5MB) • Max 1 file
                          </p>
                        </div>
                      </div>
                    )}
                  />
                </div>
              </div>
            </form>

            <div className="p-8 border-t-4 border-black flex gap-6 bg-white">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="neutral"
                  className="flex-1 h-14 font-black text-lg border-4 border-black bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-100 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                >
                  CANCEL
                </Button>
              </DialogClose>
              <Button
                onClick={form.handleSubmit(handleSubmit)}
                disabled={form.formState.isSubmitting}
                className="flex-[2] h-14 font-black text-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all bg-main text-white uppercase tracking-tighter"
              >
                {form.formState.isSubmitting ? "SAVING..." : "COMMIT CHANGES"}
              </Button>
            </div>
          </div>

          {/* Right Side: Visual Preview */}
          <div className="hidden md:flex w-[420px] bg-secondary-background border-l-4 border-black flex-col p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-main/5 -mr-32 -mt-32 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-main/5 -ml-40 -mb-40 rounded-full blur-[100px]" />

            <div className="relative z-10 w-full flex flex-col h-full">
              <div className="space-y-4 mb-10 text-center">
                <span className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground flex items-center justify-center gap-3">
                  <div className="h-[2px] w-8 bg-muted-foreground/30" />
                  Category Preview
                  <div className="h-[2px] w-8 bg-muted-foreground/30" />
                </span>
                <div className="h-2 w-24 bg-main mx-auto border-2 border-black" />
              </div>

              <div className="w-full bg-white border-4 border-black shadow-[10px_100px_80px_-40px_rgba(0,0,0,0.1),12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden transition-all duration-500 hover:-rotate-1 hover:scale-[1.02]">
                <div className="h-56 bg-gray-100 flex items-center justify-center border-b-4 border-black relative overflow-hidden group">
                  {watchedValues.image && image ? (
                    <img
                      src={image}
                      alt="Preview"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-4 text-muted-foreground/30">
                      <div className="p-6 border-4 border-dashed border-black/10 rounded-full">
                        <ImageIcon className="w-16 h-16" />
                      </div>
                      <span className="text-sm font-black uppercase tracking-tighter">
                        Category Image
                      </span>
                    </div>
                  )}
                  <div className="absolute top-4 right-4 z-20">
                    <Badge
                      className={`border-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] px-4 py-1 font-black text-xs ${
                        watchedValues.isActive
                          ? "bg-green-400 text-black"
                          : "bg-yellow-400 text-black"
                      }`}
                    >
                      {watchedValues.isActive ? "ACTIVE" : "DRAFT"}
                    </Badge>
                  </div>
                </div>

                <div className="p-8 text-left space-y-5">
                  <div className="flex items-center justify-between text-[11px] font-black text-main uppercase italic tracking-widest">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Updated Today
                    </div>
                    <span className="opacity-40">CAT-V1</span>
                  </div>

                  <h4 className="font-black text-3xl uppercase tracking-tighter leading-none wrap-break-word">
                    {watchedValues.name || "Untitled"}
                  </h4>

                  <p className="text-sm text-muted-foreground font-bold italic leading-relaxed line-clamp-3">
                    {watchedValues.description ||
                      "Start typing your description to see how this category will be presented to your customers..."}
                  </p>

                  <div className="pt-4 flex items-center justify-between border-t-2 border-black/5">
                    <Badge
                      variant="neutral"
                      className="text-[11px] border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white px-3 py-1 font-black tracking-tighter italic"
                    >
                      /{watchedValues.slug || "slug-id"}
                    </Badge>
                    <div className="flex gap-1">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="w-2 h-2 bg-black opacity-10" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-auto bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex gap-4">
                  <div className="h-10 w-10 bg-yellow-400 border-2 border-black flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <p className="text-[11px] font-bold text-muted-foreground uppercase leading-relaxed tracking-tighter">
                    Real-time preview of your changes. Ensure the name and
                    description are engaging!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
