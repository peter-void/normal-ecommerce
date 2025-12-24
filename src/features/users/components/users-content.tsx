"use client";

import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Eye,
  Pencil,
  Trash2,
  Search,
  Filter,
  ChevronDown,
  X,
} from "lucide-react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Pagination } from "@/components/pagination";

export type UserType = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  isAdmin: boolean | null;
  createdAt: Date;
};

interface UsersContentProps {
  users: UserType[];
  metadata: {
    hasNextPage: boolean;
    totalPages: number;
  };
  page: string;
}

type RoleFilter = "all" | "admin" | "user";
type StatusFilter = "all" | "verified" | "pending";

export function UsersContent({ users, metadata, page }: UsersContentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        searchQuery === "" ||
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole =
        roleFilter === "all" ||
        (roleFilter === "admin" && user.isAdmin) ||
        (roleFilter === "user" && !user.isAdmin);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "verified" && user.emailVerified) ||
        (statusFilter === "pending" && !user.emailVerified);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchQuery, roleFilter, statusFilter]);

  const activeFiltersCount =
    (roleFilter !== "all" ? 1 : 0) + (statusFilter !== "all" ? 1 : 0);

  const clearFilters = () => {
    setRoleFilter("all");
    setStatusFilter("all");
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-base border-2 border-border bg-white py-2 pl-10 pr-4 font-base shadow-shadow focus:outline-none focus:ring-2 focus:ring-main"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="flex gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="neutral" className="gap-2 relative">
                <Filter className="h-4 w-4" />
                Filter
                <ChevronDown className="h-4 w-4" />
                {activeFiltersCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full border-2 border-border bg-main text-[10px] font-bold text-main-foreground shadow-shadow">
                    {activeFiltersCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 rounded-base border-2 border-border bg-white shadow-shadow"
            >
              <DropdownMenuLabel className="font-heading">
                Role
              </DropdownMenuLabel>
              <DropdownMenuCheckboxItem
                checked={roleFilter === "all"}
                onCheckedChange={() => setRoleFilter("all")}
              >
                All Roles
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={roleFilter === "admin"}
                onCheckedChange={() => setRoleFilter("admin")}
              >
                Admin Only
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={roleFilter === "user"}
                onCheckedChange={() => setRoleFilter("user")}
              >
                User Only
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="font-heading">
                Status
              </DropdownMenuLabel>
              <DropdownMenuCheckboxItem
                checked={statusFilter === "all"}
                onCheckedChange={() => setStatusFilter("all")}
              >
                All Status
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter === "verified"}
                onCheckedChange={() => setStatusFilter("verified")}
              >
                Verified Only
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter === "pending"}
                onCheckedChange={() => setStatusFilter("pending")}
              >
                Pending Only
              </DropdownMenuCheckboxItem>
              {activeFiltersCount > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <div className="p-2">
                    <Button
                      variant="neutral"
                      size="sm"
                      className="w-full"
                      onClick={clearFilters}
                    >
                      Clear Filters
                    </Button>
                  </div>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {(activeFiltersCount > 0 || searchQuery) && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase text-gray-500">
            Active Filters:
          </span>
          {searchQuery && (
            <Badge
              variant="neutral"
              className="gap-1 rounded-base border-2 border-border px-2 py-1 font-base shadow-shadow"
            >
              Search: &quot;{searchQuery}&quot;
              <button onClick={() => setSearchQuery("")}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {roleFilter !== "all" && (
            <Badge
              variant="neutral"
              className="gap-1 rounded-base border-2 border-border px-2 py-1 font-base shadow-shadow"
            >
              Role: {roleFilter}
              <button onClick={() => setRoleFilter("all")}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {statusFilter !== "all" && (
            <Badge
              variant="neutral"
              className="gap-1 rounded-base border-2 border-border px-2 py-1 font-base shadow-shadow"
            >
              Status: {statusFilter}
              <button onClick={() => setStatusFilter("all")}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}

      <div className="overflow-hidden rounded-base border-2 border-border bg-secondary-background shadow-shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b-2 border-border bg-main font-heading text-main-foreground">
              <tr>
                <th className="px-6 py-4 font-bold uppercase tracking-wider">
                  #
                </th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider">
                  User Details
                </th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider">
                  Joined At
                </th>
                <th className="px-6 py-4 font-right font-bold uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-border">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Search className="h-10 w-10 text-gray-300" />
                      <p className="font-heading text-lg">No users found</p>
                      <p className="text-sm text-gray-500">
                        Try adjusting your search or filters.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, i) => (
                  <tr
                    key={user.id}
                    className="group bg-white transition-colors hover:bg-main/5"
                  >
                    <td className="px-6 py-4">
                      <span className="flex h-8 w-8 items-center justify-center rounded-base border-2 border-border bg-secondary-background font-heading shadow-shadow">
                        {i + 1}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-base border-2 border-border shadow-shadow bg-main/10">
                          {user.image ? (
                            <Image
                              src={user.image}
                              alt={user.name}
                              fill
                              unoptimized
                              className="object-cover transition-transform group-hover:scale-110"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center font-heading text-lg">
                              {user.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-heading text-base leading-none">
                            {user.name}
                          </span>
                          <span className="text-xs font-base text-gray-500">
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={user.isAdmin ? "default" : "neutral"}
                        className={`rounded-base border-2 border-border px-3 py-1 font-heading shadow-shadow ${
                          user.isAdmin
                            ? "bg-[#A3E635] text-black"
                            : "bg-white text-black"
                        }`}
                      >
                        {user.isAdmin ? "ADMIN" : "USER"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-2.5 w-2.5 rounded-full border border-border shadow-sm ${
                            user.emailVerified
                              ? "bg-green-400"
                              : "bg-yellow-400"
                          }`}
                        />
                        <span className="text-xs font-bold uppercase">
                          {user.emailVerified ? "VERIFIED" : "PENDING"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-heading text-sm">
                          {user.createdAt.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                        <span className="text-[10px] font-bold uppercase text-gray-400">
                          Registered
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                        <Button
                          variant="neutral"
                          size="icon"
                          className="h-10 w-10 border-2 shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none"
                        >
                          <Eye className="h-5 w-5" />
                          <span className="sr-only">View</span>
                        </Button>
                        <Button
                          variant="neutral"
                          size="icon"
                          className="h-10 w-10 border-2 shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none"
                        >
                          <Pencil className="h-5 w-5" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="neutral"
                          size="icon"
                          className="h-10 w-10 border-2 shadow-shadow hover:bg-red-400 hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none"
                        >
                          <Trash2 className="h-5 w-5" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t-2 border-border bg-secondary-background p-6">
          <div className="text-sm font-base text-gray-600">
            Showing{" "}
            <strong className="font-bold text-black">
              {filteredUsers.length}
            </strong>{" "}
            of <strong className="font-bold text-black">{users.length}</strong>{" "}
            users
          </div>
          <div className="flex gap-3">
            <Pagination
              totalPages={metadata.totalPages}
              hasNextPage={metadata.hasNextPage}
              maxWindow={5}
              page={page}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
