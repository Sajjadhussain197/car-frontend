import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest): Promise<NextResponse> {
  const { pathname } = req.nextUrl;

  if (pathname === "/") {
    return NextResponse.next();
  }

  if (pathname.startsWith("/cars") || pathname.startsWith("/submit-car")) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      const loginUrl = new URL("/", req.url); // Redirect to the login screen
      loginUrl.searchParams.set("callbackUrl", req.url); // Optional: Save the URL to redirect back after login
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};