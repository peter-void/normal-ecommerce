import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserGender } from "@/generated/prisma/enums";
import { UserAuth } from "@/types";
import { format } from "date-fns";
import { Edit3 } from "lucide-react";
import { ChangeDateOfBirth } from "./change-date-of-birth";
import { ChooseGender } from "./choose-gender";
import { DisplayNameInputForm } from "./display-name-input-form";

export function BioDataCard({
  user,
  refetch,
}: {
  user: UserAuth | undefined;
  refetch: () => void;
}) {
  return (
    <div className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-heading uppercase">Bio Data</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="group relative">
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 group-hover:text-black transition-colors">
            Display Name
          </label>
          <div className="flex items-center gap-3">
            <span className="text-xl font-heading uppercase text-black border-b-2 border-transparent group-hover:border-yellow-400 transition-colors">
              {user?.name || "Anonymous_User"}
            </span>
            <BioDataDialog
              type={BioDataDialogType.NAME}
              dialogTitle="Display Name"
              dialogDescription="You can only change your display name once the time"
              children={
                <DisplayNameInputForm
                  defaultValue={user?.name || "Anonymous_User"}
                  refetch={refetch}
                />
              }
            />
          </div>
          <div className="absolute -inset-2 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity -z-10 rounded-sm" />
        </div>

        <div className="group relative">
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 group-hover:text-black transition-colors">
            Gender
          </label>
          <div className="flex items-center gap-3">
            <span className="text-xl font-heading uppercase text-black border-b-2 border-transparent group-hover:border-yellow-400 transition-colors">
              {user?.gender ? user.gender.toLowerCase() : "Not specified"}
            </span>
            <BioDataDialog
              type={BioDataDialogType.GENDER}
              dialogTitle="Add Gender"
              dialogDescription="You can only add your gender once the time"
              children={
                <ChooseGender
                  refetch={refetch}
                  defaultValue={(user?.gender as UserGender) ?? UserGender.MALE}
                />
              }
            />
          </div>
          <div className="absolute -inset-2 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity -z-10 rounded-sm" />
        </div>

        <div className="group relative">
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 group-hover:text-black transition-colors">
            Date of Birth
          </label>
          <div className="flex items-center gap-3">
            <span className="text-xl font-heading uppercase text-black border-b-2 border-transparent group-hover:border-yellow-400 transition-colors">
              {user?.dateOfBirth
                ? format(user.dateOfBirth, "dd MMM yyyy")
                : "Not specified"}
            </span>
            <BioDataDialog
              type={BioDataDialogType.DATE_OF_BIRTH}
              dialogTitle="Edit Date of Birth"
              dialogDescription="You can only change your date of birth once the time"
              children={<ChangeDateOfBirth refetch={refetch} />}
            />
          </div>
          <div className="absolute -inset-2 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity -z-10 rounded-sm" />
        </div>
      </div>
    </div>
  );
}

enum BioDataDialogType {
  NAME = "name",
  GENDER = "gender",
  DATE_OF_BIRTH = "dateOfBirth",
}

type BioDataDialogProps =
  | {
      type: BioDataDialogType.NAME;
      dialogTitle: string;
      dialogDescription: string;
      children: React.ReactNode;
    }
  | {
      type: BioDataDialogType.GENDER;
      dialogTitle: string;
      dialogDescription: string;
      children: React.ReactNode;
    }
  | {
      type: BioDataDialogType.DATE_OF_BIRTH;
      dialogTitle: string;
      dialogDescription: string;
      children: React.ReactNode;
    };

export function BioDataDialog({
  type,
  dialogTitle,
  dialogDescription,
  children,
}: BioDataDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className="flex items-center justify-center w-8 h-8 bg-yellow-400 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-300 hover:translate-x-px hover:translate-y-px hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer"
          title="Edit Name"
        >
          <Edit3 className="w-4 h-4 text-black" />
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-bold text-2xl">
            {dialogTitle}
          </DialogTitle>
          <DialogDescription className="text-md text-gray-500">
            {dialogDescription}
          </DialogDescription>
        </DialogHeader>
        <div>{children}</div>
      </DialogContent>
    </Dialog>
  );
}
