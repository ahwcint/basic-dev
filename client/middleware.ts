import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const refreshToken = req.cookies.get("refresh_token");

  const isRefreshToken = !!refreshToken;
  const isAuthPage = req.nextUrl.pathname.startsWith("/auth");

  if (!isRefreshToken && !isAuthPage) {
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  if (isRefreshToken && isAuthPage) {
    url.pathname = "/home";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
