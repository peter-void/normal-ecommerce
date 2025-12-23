import { NextRequest, NextResponse } from "next/server";
import { auth } from "./lib/auth";
import { headers } from "next/headers";

export async function proxy(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user && req.nextUrl.pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (!session?.user && !req.nextUrl.pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  if (
    session?.user?.isAdmin !== true &&
    req.nextUrl.pathname.startsWith("/admin")
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/profile/:path*", "/auth/:path*"],
};
