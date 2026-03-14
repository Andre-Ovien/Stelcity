import { NextResponse } from "next/server"

const protectedRoutes = ["/account", "/checkout"]

export function middleware(request) {
  const token = request.cookies.get("token")?.value
  const isProtected = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  )

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/account/:path*", "/checkout/:path*"],
}