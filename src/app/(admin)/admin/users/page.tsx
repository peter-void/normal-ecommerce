import { getUsers } from "@/dal/getUsers";
import { Users, ShieldCheck, UserPlus, MailCheck } from "lucide-react";
import { UsersContent } from "@/features/users";
import { PAGE_SIZE } from "@/constants";
import { PageProps } from "@/types";

export default async function UsersPage(props: PageProps) {
  const pageNumber = (await props.searchParams)?.page as string | undefined;
  const skip = ((pageNumber ? Number(pageNumber) : 1) - 1) * PAGE_SIZE;

  const { data: users, metadata } = await getUsers({ skip, take: PAGE_SIZE });

  const totalUsers = users.length;
  const adminCount = users.filter((u) => u.isAdmin).length;
  const verifiedCount = users.filter((u) => u.emailVerified).length;

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const newUsersCount = users.filter((u) => u.createdAt > thirtyDaysAgo).length;

  const stats = [
    {
      label: "TOTAL USERS",
      value: totalUsers,
      icon: <Users className="h-6 w-6" />,
      color: "bg-main",
    },
    {
      label: "ADMINS",
      value: adminCount,
      icon: <ShieldCheck className="h-6 w-6" />,
      color: "bg-[#A3E635]",
    },
    {
      label: "NEW USERS (30D)",
      value: newUsersCount,
      icon: <UserPlus className="h-6 w-6" />,
      color: "bg-[#38BDF8]",
    },
    {
      label: "VERIFIED",
      value: verifiedCount,
      icon: <MailCheck className="h-6 w-6" />,
      color: "bg-[#FB7185]",
    },
  ];

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-heading">Users</h1>
          <p className="text-lg font-base text-gray-600">
            Manage your user community, assign roles, and track growth.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="group relative flex flex-col gap-4 rounded-base border-2 border-border bg-secondary-background p-6 shadow-shadow transition-all hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    {stat.label}
                  </p>
                  <h3 className="text-3xl font-heading">{stat.value}</h3>
                </div>
                <div
                  className={`rounded-base border-2 border-border ${stat.color} p-2 shadow-shadow`}
                >
                  {stat.icon}
                </div>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-black animate-pulse" />
                <span className="text-[10px] font-bold uppercase">
                  Real-time update
                </span>
              </div>
            </div>
          ))}
        </div>

        <UsersContent
          users={users}
          metadata={metadata}
          page={pageNumber !== undefined ? pageNumber : "1"}
        />
      </div>
    </div>
  );
}
