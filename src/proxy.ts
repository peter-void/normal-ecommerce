import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "./lib/auth";

export async function proxy(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  let response: NextResponse;

  if (session?.user && req.nextUrl.pathname.startsWith("/auth")) {
    response = NextResponse.redirect(new URL("/", req.url));
  } else if (!session?.user && !req.nextUrl.pathname.startsWith("/auth")) {
    response = NextResponse.redirect(new URL("/auth/signin", req.url));
  } else if (
    session?.user?.isAdmin !== true &&
    req.nextUrl.pathname.startsWith("/admin")
  ) {
    response = NextResponse.redirect(new URL("/", req.url));
  } else {
    response = NextResponse.next();
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/profile/:path*", "/auth/:path*"],
};
