"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { UserGender } from "@/generated/prisma/enums";
import Image from "next/image";
import { useState, useTransition } from "react";
import { GenderSchema } from "../schemas/schema";
import { toast } from "sonner";
import { updateBiodata } from "../actions/action";

interface ChooseGenderProps {
  refetch: () => void;
  defaultValue: UserGender;
}

export function ChooseGender({ refetch, defaultValue }: ChooseGenderProps) {
  const [isPending, startTransition] = useTransition();
  const [selectedGender, setSelectedGender] = useState<UserGender>(
    defaultValue ?? UserGender.MALE,
  );

  const handleChangeGender = () => {
    startTransition(async () => {
      const validatedData = GenderSchema.safeParse(selectedGender);

      if (!validatedData.success) {
        toast.error("Gender is required");
        return;
      }

      const { success, message } = await updateBiodata({
        gender: validatedData.data,
      });

      if (!success) {
        toast.error(message);
      } else {
        toast.success(message);
        refetch();
      }
    });
  };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-center gap-x-7">
        <div className="flex items-center gap-x-2">
          <Checkbox
            checked={selectedGender === UserGender.MALE}
            onCheckedChange={(e) =>
              setSelectedGender(e ? UserGender.MALE : UserGender.FEMALE)
            }
            className="rounded-full size-4"
          />
          <Image
            src="https://media.istockphoto.com/id/844000412/vector/default-placeholder-man.jpg?s=612x612&w=0&k=20&c=xFgi95ytbJgyLkN0uUDFA5M4p-Q1s25Ye_M5u86evFc="
            alt="Male"
            unoptimized
            width={50}
            height={50}
            className="size-10 rounded-full"
          />
          <div className="text-gray-600">Male</div>
        </div>

        <div className="flex items-center gap-x-2">
          <Checkbox
            checked={selectedGender === UserGender.FEMALE}
            onCheckedChange={(e) =>
              setSelectedGender(e ? UserGender.FEMALE : UserGender.MALE)
            }
            className="rounded-full size-4"
          />
          <Image
            src="https://media.istockphoto.com/id/2014684899/vector/placeholder-avatar-female-person-default-woman-avatar-image-gray-profile-anonymous-face.jpg?s=612x612&w=0&k=20&c=D-dk9ek0_jb19TiMVNVmlpvYVrQiFiJmgGmiLB5yE4w="
            alt="Female"
            unoptimized
            width={50}
            height={50}
            className="size-10 rounded-full"
          />
          <div className="text-gray-600">Female</div>
        </div>
      </div>

      <Button
        className="w-full mt-7 h-11 bg-black text-white hover:bg-gray-800 font-bold uppercase tracking-widest text-xs rounded-none"
        onClick={handleChangeGender}
        disabled={isPending}
      >
        Save
      </Button>
    </div>
  );
}
