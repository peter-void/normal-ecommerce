import { Pagination } from "@/components/pagination";
import { PAGE_SIZE } from "@/constants";
import { getProductCategories } from "@/dal/getCategories";
import { getProducts } from "@/dal/getProducts";
import { AddProductButton } from "@/features/admin/products/components/add-product-button";
import { ProductsTable } from "@/features/admin/products/components/products-table";
import prisma from "@/lib/prisma";
import { PageProps } from "@/types";
import {
  AlertTriangle,
  CheckCircle2,
  Package,
  Search,
  XCircle,
} from "lucide-react";

export default async function Page(props: PageProps) {
  const searchParams = await props.searchParams;
  const pageNumber = searchParams?.page as string | undefined;
  const searchQuery = (searchParams?.search as string) || "";
  const statusFilter = (searchParams?.status as string) || "";

  const skip = ((pageNumber ? Number(pageNumber) : 1) - 1) * PAGE_SIZE;

  const { data: products, metadata } = await getProducts({
    take: PAGE_SIZE,
    skip,
    search: searchQuery || undefined,
    status: statusFilter || undefined,
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
    { label: "Total", value: totalCount, icon: Package },
    { label: "Active", value: activeCount, icon: CheckCircle2 },
    { label: "Out of Stock", value: outOfStockCount, icon: XCircle },
    { label: "Low Stock", value: lowStockCount, icon: AlertTriangle },
  ];

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight">
            Products
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your inventory and organize your store listings.
          </p>
        </div>
        <AddProductButton categories={categories} />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="border border-gray-200 bg-white p-5">
            <div className="flex items-center gap-2 text-gray-400 mb-3">
              <stat.icon className="h-4 w-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">
                {stat.label}
              </span>
            </div>
            <p className="text-3xl font-black tracking-tight">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <form method="GET" className="flex flex-1 gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              name="search"
              defaultValue={searchQuery}
              placeholder="Search products..."
              className="w-full h-10 pl-10 pr-4 border border-gray-300 text-sm focus:outline-none focus:border-black rounded-none bg-white"
            />
          </div>
          <select
            name="status"
            defaultValue={statusFilter}
            className="h-10 px-3 border border-gray-300 text-sm focus:outline-none focus:border-black rounded-none bg-white font-bold text-gray-600 cursor-pointer"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
          </select>
          <button
            type="submit"
            className="h-10 px-5 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
          >
            Filter
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="border border-gray-200 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <ProductsTable
            products={products}
            skip={skip}
            categories={categories}
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-gray-100 bg-gray-50 px-6 py-4 gap-4">
          <p className="text-xs text-gray-500">
            Showing <span className="font-bold text-black">{skip + 1}</span>
            {" – "}
            <span className="font-bold text-black">
              {Math.min(skip + PAGE_SIZE, products.length + skip)}
            </span>
            {" of "}
            <span className="font-bold text-black">
              {metadata.totalPages * PAGE_SIZE}
            </span>{" "}
            products
          </p>
          <Pagination
            page={pageNumber}
            totalPages={metadata.totalPages}
            hasNextPage={metadata.hasNextPage}
          />
        </div>
      </div>
    </div>
  );
}
