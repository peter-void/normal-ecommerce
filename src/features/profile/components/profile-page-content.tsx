"use client";

import { UserAuth } from "@/types";
import { Loader2Icon } from "lucide-react";
import { BioDataCard } from "./bio-data-card";
import { ContactsCard } from "./contacts-card";
import { DisplayUserCard } from "./display-user-card";
import { authClient } from "@/lib/auth-client";

interface ProfilePageContentProps {
  user?: UserAuth;
}

export function ProfilePageContent({ user }: ProfilePageContentProps) {
  const { data: session, refetch } = authClient.useSession();

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2Icon className="animate-spin size-4" />
      </div>
    );
  }

  return (
    <div className="w-full font-base space-y-8">
      <div className="flex items-end justify-between border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-black uppercase tracking-tight">
          My Profile
        </h1>
        <span className="font-bold text-xs uppercase tracking-widest text-gray-400">
          Personal Settings
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <DisplayUserCard user={user!} refetch={refetch} />

        <div className="lg:col-span-8 flex flex-col gap-8">
          <BioDataCard user={user!} refetch={refetch} />

          <ContactsCard user={user!} />
        </div>
      </div>
    </div>
  );
}
