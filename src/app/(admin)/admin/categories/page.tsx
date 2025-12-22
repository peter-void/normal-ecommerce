import { Pagination } from "@/components/pagination";
import { PAGE_SIZE } from "@/constants";
import { getCategories } from "@/dal/getCategories";
import { AddNewCategoryButton } from "@/features/admin/categories/components/add-new-category-button";
import { CategoriesTable } from "@/features/admin/categories/components/categories-table";
import { PageProps } from "@/types";
import prisma from "@/lib/prisma";
import { LayoutGrid, CheckCircle2, XCircle, MoreVertical } from "lucide-react";

export default async function Page(props: PageProps) {
  const pageNumber = (await props.searchParams)?.page as string | undefined;

  const skip = ((pageNumber ? Number(pageNumber) : 1) - 1) * PAGE_SIZE;
  const { data: categories, metadata } = await getCategories({
    take: PAGE_SIZE,
    skip,
  });

  const [totalCount, activeCount, inactiveCount] = await Promise.all([
    prisma.category.count(),
    prisma.category.count({ where: { isActive: true } }),
    prisma.category.count({ where: { isActive: false } }),
  ]);

  const stats = [
    {
      title: "Total Categories",
      value: totalCount,
      icon: LayoutGrid,
      color: "bg-main text-main-foreground",
    },
    {
      title: "Active",
      value: activeCount,
      icon: CheckCircle2,
      color: "bg-green-200 text-green-900",
    },
    {
      title: "Inactive",
      value: inactiveCount,
      icon: XCircle,
      color: "bg-red-200 text-red-900",
    },
  ];

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-heading">Categories</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Manage and organize your food items effectively.
          </p>
        </div>
        <AddNewCategoryButton />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-secondary-background border-2 border-border rounded-xl p-6 shadow-shadow flex flex-col justify-between h-36 transition-transform hover:-translate-y-1"
          >
            <div className="flex justify-between items-start">
              <span className="font-heading text-sm uppercase tracking-wider text-muted-foreground">
                {stat.title}
              </span>
              <stat.icon className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex items-end justify-between">
              <span className="text-5xl font-heading">{stat.value}</span>
              <div
                className={`flex items-center gap-1 px-3 py-1 rounded-base text-xs font-bold ${stat.color} border-2 border-border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}
              >
                Overview
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="w-full space-y-4">
        <div className="w-full overflow-hidden rounded-xl border-2 border-border bg-secondary-background shadow-shadow">
          <div className="overflow-x-auto">
            <CategoriesTable categories={categories} skip={skip} />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between border-t-2 border-border bg-main/5 p-6 gap-4">
            <div className="text-sm font-base text-muted-foreground">
              Showing{" "}
              <span className="font-bold text-foreground">{skip + 1}</span> to{" "}
              <span className="font-bold text-foreground">
                {Math.min(skip + PAGE_SIZE, totalCount)}
              </span>{" "}
              of <span className="font-bold text-foreground">{totalCount}</span>{" "}
              categories
            </div>
            <div className="flex gap-2">
              <Pagination
                page={pageNumber}
                totalPages={metadata.totalPages}
                hasNextPage={metadata.hasNextPage}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
