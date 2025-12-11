"use client";

import { authClient } from "@/lib/auth-client";
import { Loader2Icon } from "lucide-react";
import { BioDataCard } from "./bio-data-card";
import { ContactsCard } from "./contacts-card";
import { DisplayUserCard } from "./display-user-card";

function SecurityAction({
  icon: Icon,
  title,
  description,
}: {
  icon: any;
  title: string;
  description: string;
}) {
  return (
    <button className="w-full flex items-center gap-4 bg-white border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all text-left group">
      <div className="w-10 h-10 bg-pink-500 border-2 border-black flex items-center justify-center shrink-0 group-hover:bg-pink-400 transition-colors">
        <Icon className="w-5 h-5 text-black" />
      </div>
      <div>
        <h4 className="font-heading text-sm uppercase">{title}</h4>
        <p className="text-xs text-gray-500 font-base mt-2 leading-tight">
          {description}
        </p>
      </div>
    </button>
  );
}

export function ProfilePageContent() {
  const { data, isPending, refetch } = authClient.useSession();

  if (isPending && !data?.user) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2Icon className="animate-spin size-4" />
      </div>
    );
  }

  const user = data?.user;

  return (
    <div className="w-full font-base space-y-8">
      <div className="flex items-end justify-between border-b-4 border-black pb-2">
        <h1 className="text-4xl md:text-5xl font-heading uppercase tracking-tighter">
          My Profile
        </h1>
        <span className="font-bold text-xs md:text-sm uppercase bg-black text-white px-3 py-1 mb-1 transform -rotate-2">
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
