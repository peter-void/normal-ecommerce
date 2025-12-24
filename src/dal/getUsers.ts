import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function getUsers({ skip, take }: { skip: number; take: number }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/signin");
  }

  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take,
    skip,
  });

  const count = await prisma.user.count();

  return {
    data: users,
    metadata: {
      hasNextPage: skip + take < count,
      totalPages: Math.ceil(count / take),
    },
  };
}
