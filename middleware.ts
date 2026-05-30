import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Check for auth token cookie set by the backend
    const tokenCookie = request.cookies.get("token")
    const hasValidToken = tokenCookie && tokenCookie.value && tokenCookie.value !== "undefined" && tokenCookie.value !== "null"

    // If accessing dashboard and not authenticated, redirect to login
    if (pathname.startsWith("/dashboard") && !hasValidToken) {
        const loginUrl = new URL("/login", request.url)
        loginUrl.searchParams.set("redirect", pathname)
        const response = NextResponse.redirect(loginUrl)
        // Clear the invalid cookie if it exists
        if (tokenCookie) {
            response.cookies.delete("token")
        }
        return response
    }

    // If visiting login, handle logout query param or redirect authenticated users
    if (pathname === "/login") {
        if (request.nextUrl.searchParams.has("logout")) {
            const response = NextResponse.next()
            response.cookies.delete("token")
            return response
        }
        if (hasValidToken) {
            return NextResponse.redirect(new URL("/dashboard", request.url))
        }
    }

    return NextResponse.next()

}

export const config = {
    matcher: ["/dashboard/:path*", "/login"],
}
