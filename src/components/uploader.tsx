"use client";

import { DEFAULT_MAX_FILES, DEFAULT_MAX_SIZE } from "@/constants";
import { ProductUploaderCard } from "@/features/admin/products/components/product-uploader-card";
import { deleteImage, uploadImage } from "@/features/images/actions/action";
import { Image } from "@/generated/prisma/client";
import { cn, generatePublicImageURL } from "@/lib/utils";
import { BaseUploadFile } from "@/types";
import { AnimatePresence } from "framer-motion";
import { CloudUpload } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

type UploaderProps =
  | {
      isEditMode: true;
      onChange: (value: { id: string; key: string }[]) => void;
      maxFiles?: number;
      maxSize?: number;
      disabled?: boolean;
      images?: Image[];
    }
  | {
      isEditMode?: false;
      onChange?: (value: { id: string; key: string }[]) => void;
      maxFiles?: number;
      maxSize?: number;
      disabled?: boolean;
    };

type EditModeUploadFile = BaseUploadFile & {
  isEditItem: true;
  file: Image;
};

type NewUploadFile = BaseUploadFile & {
  isEditItem: false;
  file: File;
};

export type UploadFile = EditModeUploadFile | NewUploadFile;

export function Uploader({
  isEditMode,
  maxFiles = DEFAULT_MAX_FILES,
  maxSize = DEFAULT_MAX_SIZE,
  onChange,
  disabled,
  images,
}: UploaderProps & { images?: Image[] }) {
  const [files, setFiles] = useState<UploadFile[]>([]);

  const onDropRejected = useCallback((fileRejections: FileRejection[]) => {
    const tooManyFiles = fileRejections.find(
      (fileRejection) => fileRejection.errors[0].code === "too-many-files"
    );

    if (tooManyFiles) {
      toast.error("Too many files");
      return;
    }

    const tooLargeFiles = fileRejections.find(
      (fileRejection) => fileRejection.errors[0].code === "file-too-large"
    );

    if (tooLargeFiles) {
      toast.error("File too large");
      return;
    }
  }, []);

  const uploadFile = useCallback(
    async (file: File) => {
      setFiles((prevState) =>
        prevState.map((item) =>
          (item.file as File).name === file.name
            ? { ...item, isUploading: true }
            : item
        )
      );

      try {
        const response = await fetch("/api/s3/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
          }),
        });

        if (!response.ok) {
          setFiles((prevFiles) => [
            ...prevFiles.map((item) =>
              (item.file as File).name === file.name
                ? { ...item, error: true, isUploading: false, progress: 0 }
                : item
            ),
          ]);

          toast.error("Failed to upload file");
          return;
        }

        const { key, signedUrl } = await response.json();

        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();

          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              const progress = (event.loaded / event.total) * 100;
              setFiles((prevFiles) => [
                ...prevFiles.map((item) =>
                  (item.file as File).name === file.name
                    ? { ...item, progress: Math.round(progress), key }
                    : item
                ),
              ]);
            }
          };

          xhr.onload = async () => {
            if (xhr.status === 200 || xhr.status === 204) {
              const publicImageURL = generatePublicImageURL(key);

              setFiles((prevFiles) => [
                ...prevFiles.map((item) =>
                  (item.file as File).name === file.name
                    ? {
                        ...item,
                        isUploading: false,
                        progress: 100,
                        error: false,
                        publicImageURL,
                      }
                    : item
                ),
              ]);

              const { success, message, data } = await uploadImage(key);

              if (!success) {
                toast.error(message);
                return;
              }

              setFiles((prevFiles) => [
                ...prevFiles.map((item) =>
                  (item.file as File).name === file.name
                    ? { ...item, imageId: data }
                    : item
                ),
              ]);

              toast.success("File uploaded successfully");
              resolve();
            } else {
              setFiles((prevFiles) =>
                prevFiles.filter(
                  (item) => (item.file as File).name !== file.name
                )
              );
              reject(new Error("Failed to upload file"));
              console.log(xhr.statusText);
            }
          };

          xhr.onerror = () => {
            // This will be happen when the request failed
            reject(new Error("Failed to upload file"));
          };

          if (signedUrl) {
            xhr.open("PUT", signedUrl);
            xhr.setRequestHeader("Content-Type", file.type);
            xhr.send(file);
          }
        });
      } catch (error) {
        toast.error("Failed to upload file");

        setFiles((prevFiles) => [
          ...prevFiles.map((item) =>
            !item.isEditItem && item.file.name === file.name
              ? { ...item, error: true, isUploading: false, progress: 0 }
              : item
          ),
        ]);
      }
    },
    [files]
  );

  const onDrop = (acceptedFiles: File[]) => {
    const duplicateFile = files.find((file) =>
      acceptedFiles.find((f) => f.name === (file.file as File).name)
    );

    if (duplicateFile) {
      toast.error(`${(duplicateFile.file as File).name} already exists`);
      return;
    }

    if (acceptedFiles.length) {
      acceptedFiles.forEach((file) => {
        const objectUrl = URL.createObjectURL(file);

        setFiles((prevFiles) => [
          ...prevFiles,
          {
            id: uuidv4(),
            isEditItem: false,
            file,
            objectUrl,
            error: false,
            isDeleting: false,
            isUploading: false,
            progress: 0,
          },
        ]);
      });

      for (const file of acceptedFiles) {
        uploadFile(file);
      }
    }
  };

  const removeFile = async (id: string) => {
    try {
      const file = files.find((file) => file.id === id);

      if (!file) {
        return;
      }

      const response = await fetch("/api/s3/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: file.key }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete file");
      }

      if (file.imageId) {
        URL.revokeObjectURL(file.objectUrl!);

        await deleteImage(file.imageId);

        setFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
      }
      toast.success("File deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete file");
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    accept: {
      "image/*": [],
    },
    maxFiles,
    maxSize,
    disabled,
  });

  useEffect(() => {
    if (isEditMode) {
      setFiles(
        images?.map((image) => ({
          id: image.id,
          isEditItem: true,
          file: image,
          objectUrl: image.src,
          error: false,
          isDeleting: false,
          isUploading: false,
          progress: 100,
          imageId: image.id,
          publicImageURL: image.src,
          key: image.key,
        })) ?? []
      );
    }
  }, [isEditMode]);

  useEffect(() => {
    onChange?.(
      isEditMode
        ? files?.map((file) => ({
            id: file.imageId!,
            key: file.key!,
            placeholder: file.objectUrl,
          })) ?? []
        : files.map((file) => ({
            id: file.imageId!,
            key: file.key!,
            placeholder: file.objectUrl,
          }))
    );
  }, [files, isEditMode]);

  return (
    <div className="w-full space-y-5">
      <div
        {...getRootProps()}
        className={cn(
          "relative flex flex-col items-center justify-center w-full py-12 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 ease-in-out hover:bg-accent/50 group",
          isDragActive
            ? "border-primary bg-primary/5 ring-4 ring-primary/10"
            : "border-muted-foreground/20 bg-card/50 hover:border-primary/50"
        )}
      >
        <input {...getInputProps()} />
        <div
          className={cn(
            "flex h-20 w-20 items-center justify-center rounded-2xl bg-muted/80 backdrop-blur-sm transition-all duration-300 group-hover:scale-105 group-hover:bg-background group-hover:shadow-lg ring-1 ring-border/50",
            isDragActive && "bg-background shadow-xl ring-primary/30 scale-110"
          )}
        >
          <CloudUpload
            className={cn(
              "h-10 w-10 text-muted-foreground transition-colors duration-300",
              isDragActive ? "text-primary" : "group-hover:text-primary"
            )}
            strokeWidth={1.5}
          />
        </div>
        <div className="mt-5 space-y-1 text-center">
          <h3
            className={cn(
              "font-semibold text-lg transition-colors duration-300",
              isDragActive ? "text-primary" : "text-foreground"
            )}
          >
            {isDragActive ? "Drop here to upload" : "Click to upload"}
          </h3>
          <p className="text-sm text-muted-foreground font-medium">
            or drag and drop
          </p>
          <p className="text-xs text-muted-foreground/70 pt-2">
            SVG, PNG, JPG or GIF (max. {maxSize / 1024 / 1024}MB)
          </p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {files.map((file) => (
              <ProductUploaderCard
                key={file.id}
                file={file}
                removeFile={removeFile}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
