import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import { NextResponse } from 'next/server';

const { auth } = NextAuth(authConfig);

export default auth((request) => {
  const token = request.auth?.user; // request.auth contains the decrypted session token
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
});

// Tell Next.js which paths this middleware should run on
export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
};