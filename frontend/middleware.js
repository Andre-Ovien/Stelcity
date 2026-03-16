import { NextResponse } from "next/server"

const protectedRoutes = ["/profile", "/checkout"]

export function middleware(request) {
  const token = request.cookies.get("token")?.value
  const isProtected = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  )

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/auth", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/profile/:path*", "/checkout/:path*"],
}