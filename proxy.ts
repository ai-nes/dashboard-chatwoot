import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

const getUserRoles = (token: string | undefined): string[] => {
  if (!token) return [];
  try {
    const decoded = jwtDecode(token) as { role?: string | string[]; exp?: number } | null;
    if (decoded?.exp && decoded.exp < Math.floor(Date.now() / 1000)) return [];
    if (!decoded?.role) return [];
    return Array.isArray(decoded.role) ? decoded.role : [decoded.role];
  } catch {
    return [];
  }
};

const hasRole = (roles: string[], target: string) => roles.includes(target);

const getPrimaryRole = (roles: string[]) => {
  if (roles.includes("ROLE_ADMIN")) return "ROLE_ADMIN";
  if (roles.includes("ROLE_AGENT")) return "ROLE_AGENT";
  if (roles.includes("ROLE_STUDENT")) return "ROLE_STUDENT";
  return null;
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("authToken")?.value;
  const userRoles = getUserRoles(token);
  const primaryRole = getPrimaryRole(userRoles);

  if (pathname.endsWith(".xml") || pathname.endsWith(".json")) return NextResponse.next();

  const publicRoutes = ["/", "/login", "/register", "/reset-password"];
  const authRoutes = ["/login", "/register", "/reset-password"];

  const isPublicRoute = publicRoutes.some((r) => pathname === r || pathname.startsWith(`${r}/`));
  const isAuthRoute = authRoutes.some((r) => pathname === r || pathname.startsWith(`${r}/`));

  if (!token || userRoles.length === 0) {
    if (isPublicRoute) return NextResponse.next();
    const res = NextResponse.redirect(new URL("/login", request.url));
    if (token) res.cookies.delete("authToken");
    return res;
  }

  if (isAuthRoute) {
    if (primaryRole === "ROLE_ADMIN")
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    if (primaryRole === "ROLE_AGENT")
      return NextResponse.redirect(new URL("/agent/dashboard", request.url));
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  const isAdminRoute = pathname.startsWith("/admin/");
  const isAgentRoute = pathname.startsWith("/agent/");

  if (hasRole(userRoles, "ROLE_ADMIN")) {
    if (isAdminRoute) return NextResponse.next();
    if (isAgentRoute && hasRole(userRoles, "ROLE_AGENT")) return NextResponse.next();
    if (!isPublicRoute && !pathname.startsWith("/dashboard"))
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    return NextResponse.next();
  }

  if (hasRole(userRoles, "ROLE_AGENT")) {
    if (isAdminRoute) return NextResponse.redirect(new URL("/agent/dashboard", request.url));
    if (isAgentRoute || pathname.startsWith("/dashboard")) return NextResponse.next();
    return NextResponse.next();
  }

  if (hasRole(userRoles, "ROLE_STUDENT")) {
    if (isAdminRoute || isAgentRoute)
      return NextResponse.redirect(new URL("/dashboard", request.url));
    return NextResponse.next();
  }

  const res = NextResponse.redirect(new URL("/login", request.url));
  res.cookies.delete("authToken");
  return res;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|webm|mp4|xml|glb)$).*)",
  ],
};
