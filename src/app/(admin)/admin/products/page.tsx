import { Pagination } from "@/components/pagination";
import { PAGE_SIZE } from "@/constants";
import { getProductCategories } from "@/dal/getCategories";
import { getProducts } from "@/dal/getProducts";
import { AddProductButton } from "@/features/admin/products/components/add-product-button";
import { ProductsTable } from "@/features/admin/products/components/products-table";
import prisma from "@/lib/prisma";
import { PageProps } from "@/types";
import { AlertTriangle, CheckCircle2, Package, XCircle } from "lucide-react";

export default async function Page(props: PageProps) {
  const pageNumber = (await props.searchParams)?.page as string | undefined;

  const skip = ((pageNumber ? Number(pageNumber) : 1) - 1) * PAGE_SIZE;
  const { data: products, metadata } = await getProducts({
    take: PAGE_SIZE,
    skip,
  });

  const [
    categories,
    [totalCount, activeCount, outOfStockCount, lowStockCount],
  ] = await Promise.all([
    getProductCategories(),
    Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { isActive: true } }),
      prisma.product.count({ where: { stock: 0 } }),
      prisma.product.count({ where: { stock: { gt: 0, lte: 10 } } }),
    ]),
  ]);

  const stats = [
    {
      label: "Total Products",
      value: totalCount,
      icon: Package,
      color: "bg-blue-400",
    },
    {
      label: "Active Products",
      value: activeCount,
      icon: CheckCircle2,
      color: "bg-green-400",
    },
    {
      label: "Out of Stock",
      value: outOfStockCount,
      icon: XCircle,
      color: "bg-red-400",
    },
    {
      label: "Low Stock",
      value: lowStockCount,
      icon: AlertTriangle,
      color: "bg-yellow-400",
    },
  ];

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-heading">Products</h1>
          <p className="text-muted-foreground font-base text-lg">
            Manage your inventory and organize your store listings.
          </p>
        </div>
        <AddProductButton categories={categories} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="group relative overflow-hidden rounded-xl border-2 border-border bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  {stat.label}
                </p>
                <p className="mt-1 text-4xl font-heading leading-none">
                  {stat.value}
                </p>
              </div>
              <div
                className={`rounded-base border-2 border-border ${stat.color} p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-none transition-all`}
              >
                <stat.icon className="h-6 w-6 text-black" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs font-bold text-muted-foreground uppercase">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-border mr-2" />
              Real-time update
            </div>
          </div>
        ))}
      </div>

      <div className="w-full space-y-4">
        <div className="w-full overflow-hidden rounded-xl border-2 border-border bg-secondary-background shadow-shadow">
          <div className="overflow-x-auto overflow-y-visible">
            <ProductsTable
              products={products}
              skip={skip}
              categories={categories}
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between border-t-2 border-border bg-white/50 p-6 gap-4">
            <div className="text-sm font-base text-muted-foreground">
              Showing <span className="font-bold text-black">{skip + 1}</span>{" "}
              to{" "}
              <span className="font-bold text-black">
                {Math.min(skip + PAGE_SIZE, products.length + skip)}
              </span>{" "}
              of{" "}
              <span className="font-bold text-black">
                {metadata.totalPages * PAGE_SIZE}
              </span>{" "}
              products
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
