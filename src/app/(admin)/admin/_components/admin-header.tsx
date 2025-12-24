"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";

export function AdminHeader() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-4 border-b px-6 w-full bg-white">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <h1 className="text-2xl font-black ml-2 uppercase tracking-tighter">
          Dashboard
        </h1>
      </div>
    </header>
  );
}
