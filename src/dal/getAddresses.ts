import { MAX_ADDRESS } from "@/constants";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function getMainAddress() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/signin");
  }

  const mainAddress = await prisma.address.findFirst({
    where: {
      userId: session.user.id,
      mainAddress: true,
    },
  });

  if (!mainAddress) {
    redirect("/profile/address");
  }

  return mainAddress;
}

export async function getAddresses() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/signin");
  }

  const addresses = await prisma.address.findMany({
    where: {
      userId: session.user.id,
    },
    take: MAX_ADDRESS,
  });

  return addresses;
}
