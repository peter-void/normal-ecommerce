"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { updateBiodata } from "../actions/action";
import { DisplayNameInputFormSchema } from "../schemas/schema";
import { useRouter } from "next/navigation";

interface DisplayNameInputFormProps {
  defaultValue?: string;
  refetch: () => void;
}

export function DisplayNameInputForm({
  defaultValue,
  refetch,
}: DisplayNameInputFormProps) {
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState(defaultValue);
  const router = useRouter();

  const handleSubmit = () => {
    startTransition(async () => {
      const validatedData = DisplayNameInputFormSchema.safeParse({
        displayName: value,
      });

      if (!validatedData.success) return;

      const { success, message } = await updateBiodata({
        displayName: validatedData.data.displayName,
      });

      if (!success) {
        toast.error(message);
      } else {
        toast.success(message);
        refetch();
        router.refresh();
      }
    });
  };

  return (
    <div className="mt-2">
      <div className="space-y-5">
        <div className="flex flex-col space-y-2">
          <Label>Display Name</Label>
          <Input
            value={value}
            onChange={(e) => {
              const changedData = e.target.value;
              const sanitizedData = changedData.replace(/[^a-zA-Z\s]/g, "");
              setValue(sanitizedData);
            }}
          />
        </div>

        <Button
          disabled={defaultValue === value || !value || isPending}
          className="w-full h-11 bg-black text-white hover:bg-gray-800 font-bold uppercase tracking-widest text-xs rounded-none"
          onClick={handleSubmit}
        >
          {isPending ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
}
