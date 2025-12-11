import { DEFAULT_MAX_SIZE } from "@/constants";
import { BaseUploadFile, UserAuth } from "@/types";
import { Loader2Icon, User } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { updateProfileImage } from "../actions/action";
import { generatePublicImageURL } from "@/lib/utils";
import { format } from "date-fns";

export function DisplayUserCard({
  user,
  refetch,
}: {
  user: UserAuth | undefined;
  refetch: () => void;
}) {
  return (
    <div className="lg:col-span-4 space-y-8">
      <div className="w-full bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="h-24 bg-pattern-dots bg-cyan-400 border-b-2 border-black relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_1px_1px,#000_1px,transparent_0)] bg-size-[10px_10px]" />
        </div>

        <div className="px-6 pb-6 -mt-12 flex flex-col items-center text-center">
          <ChangeAvatarInput userImage={user?.image!} refetch={refetch} />

          <h2 className="text-xl font-heading uppercase leading-none mb-1">
            {user?.name || "User Name"}
          </h2>
          <p className="text-sm text-gray-500 font-medium mb-6">
            {user?.email}
          </p>

          <div className="w-full grid grid-cols-2 gap-2 text-center text-xs font-bold border-t-2 border-black pt-4">
            <div>
              <span className="block text-gray-400 uppercase text-[10px]">
                Status
              </span>
              <span>{user?.isAdmin ? "ADMIN" : "MEMBER"}</span>
            </div>
            <div>
              <span className="block text-gray-400 uppercase text-[10px]">
                Joined
              </span>
              <span>{format(user?.createdAt!, "MMM yyyy")}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChangeAvatarInput({
  userImage,
  refetch,
}: {
  userImage: string | null;
  refetch: () => void;
}) {
  const [file, setFile] = useState<
    (Omit<BaseUploadFile, "id" | "imageId"> & { file?: File }) | null
  >(null);

  const onDropRejected = useCallback((fileRejections: FileRejection[]) => {
    const tooLargeFiles = fileRejections.find(
      (fileRejection) => fileRejection.errors[0].code === "file-too-large"
    );

    if (tooLargeFiles) {
      toast.error("File too large");
      return;
    }
  }, []);

  const uploadFile = async (file: File) => {
    setFile((prev) => ({
      ...prev,
      isUploading: true,
    }));

    try {
      const response = await fetch("/api/s3/upload", {
        method: "POST",
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
        }),
      });

      if (!response.ok) {
        setFile((prev) => ({
          ...prev,
          isUploading: false,
          error: true,
          progress: 0,
        }));

        toast.error("Failed to upload file");
        return;
      }

      const { key, signedUrl } = await response.json();

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const progress = (event.loaded / event.total) * 100;
            setFile((prev) => ({
              ...prev,
              progress: Math.round(progress),
              key,
            }));
          }
        };

        xhr.onload = async () => {
          if (xhr.status === 200 || xhr.status === 204) {
            const publicImageURL = generatePublicImageURL(key);

            setFile((prev) => ({
              ...prev,
              isUploading: false,
              progress: 100,
              error: false,
              publicImageURL,
            }));

            updateProfileImage(publicImageURL).then(() => {
              refetch();
            });

            toast.success("File uploaded successfully");
            resolve();
          } else {
            setFile((prev) => ({
              ...prev,
              isUploading: false,
              error: true,
              progress: 0,
            }));

            reject(new Error("Failed to upload file"));
          }
        };

        xhr.onerror = () => {
          setFile((prev) => ({
            ...prev,
            isUploading: false,
            error: true,
            progress: 0,
          }));

          reject(new Error("Failed to upload file"));
        };

        xhr.open("PUT", signedUrl);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.send(file);
      });
    } catch (error) {
      toast.error("Failed to upload file");
      setFile((prev) => ({
        ...prev,
        isUploading: false,
        error: true,
        progress: 0,
      }));
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length) {
      const objectUrl = URL.createObjectURL(acceptedFiles[0]);
      const file = acceptedFiles[0];

      setFile({
        objectUrl,
        file,
        error: false,
        isDeleting: false,
        isUploading: false,
        key: undefined,
        progress: 0,
        publicImageURL: undefined,
      });

      uploadFile(file);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    onDropRejected,
    accept: {
      "image/*": [],
    },
    maxFiles: 1,
    maxSize: DEFAULT_MAX_SIZE,
  });

  return (
    <>
      <div className="relative w-32 h-32 bg-yellow-400 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center shrink-0 mb-4 overflow-hidden group cursor-pointer hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all rounded-full">
        {file?.objectUrl || userImage ? (
          <Image
            src={file?.objectUrl ?? userImage!}
            alt="User"
            fill
            unoptimized
            className="w-full h-full object-cover"
          />
        ) : (
          <User className="w-16 h-16 text-black" />
        )}

        {file?.isUploading && (
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-20">
            <Loader2Icon className="w-8 h-8 text-white animate-spin mb-1" />
            <span className="text-[10px] text-white font-bold uppercase tracking-wider">
              Uploading
            </span>
          </div>
        )}

        <div
          {...getRootProps()}
          className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center z-10"
        >
          <span className="text-white text-xs font-bold uppercase tracking-wider border-b-2 border-yellow-400 pb-1">
            Change
          </span>
          <input {...getInputProps()} />
        </div>
      </div>
    </>
  );
}
