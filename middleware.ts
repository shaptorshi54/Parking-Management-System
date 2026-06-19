import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  // Grab the cookie to see if they are logged in.
  // Note: secret must match your NEXTAUTH_SECRET in .env
  const token = await getToken({ 
    req: request, 
    secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET 
  });
  
  const currentPath = request.nextUrl.pathname;

  // ─── RULE 1: Protect the Login/Register pages ───
  if (token && (currentPath === "/login" || currentPath === "/register")) {
      if (token.role === "USER") {
          return NextResponse.redirect(new URL("/dashboard/spotter", request.url));
      } else {
          return NextResponse.redirect(new URL("/dashboard/owner", request.url));
      }
  }

  // ─── RULE 2: Protect the Dashboards ───
  if (!token && currentPath.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/login", request.url));
  }

  // ─── RULE 3: Cross-Role Protection ───
  if (token?.role === "USER" && currentPath.startsWith("/dashboard/owner")) {
      return NextResponse.redirect(new URL("/dashboard/spotter", request.url));
  }
  
  if (token?.role === "OWNER" && currentPath.startsWith("/dashboard/spotter")) {
      return NextResponse.redirect(new URL("/dashboard/owner", request.url));
  }

  // If everything is fine, let them through!
  return NextResponse.next();
}

// Tell Next.js which paths this middleware should run on
export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
};