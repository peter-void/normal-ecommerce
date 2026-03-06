"use client";

import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { BoxesIcon, Heart, LogOut, MapPin, Shield, User } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const sidebarItems = [
  { title: "Profile", href: "/profile", icon: User },
  { title: "Wishlist", href: "/profile/wishlist", icon: Heart },
  { title: "Address", href: "/profile/address", icon: MapPin },
  { title: "Orders", href: "/profile/order", icon: BoxesIcon },
  { title: "Security", href: "/profile/security", icon: Shield },
];

export function ProfileSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => router.push("/"),
      },
    });
  };

  return (
    <aside className="w-full md:w-[220px] shrink-0">
      <nav className="flex flex-col">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 px-4 py-3 text-sm font-semibold uppercase tracking-widest transition-colors border-l-2",
                  isActive
                    ? "border-black text-black bg-gray-50"
                    : "border-transparent text-gray-400 hover:text-black hover:bg-gray-50",
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {item.title}
              </div>
            </Link>
          );
        })}

        <div className="h-px w-full bg-gray-200 my-2" />

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-sm font-semibold uppercase tracking-widest text-gray-400 hover:text-black hover:bg-gray-50 transition-colors border-l-2 border-transparent w-full text-left"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Logout
        </button>
      </nav>
    </aside>
  );
}
