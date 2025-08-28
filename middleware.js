import { NextResponse } from "next/server"
import { jwtVerify } from "jose"
import { WEBSITE_LOGIN, USER_DASHBOARD } from "./routes/WebsiteRoute"
import { ADMIN_DASHBOARD } from "./routes/AdminPanelRoute"

export async function middleware(request) {
    try {
        const pathname = request.nextUrl.pathname
        const hasToken = request.cookies.has('access_token')

        if (!hasToken) {
            if (!pathname.startsWith('/auth')) {
                return NextResponse.redirect(new URL(WEBSITE_LOGIN, request.nextUrl))
            }
            return NextResponse.next()
        }
        
        // verify token
        const access_token = request.cookies.get('access_token').value
        const {payload} = await jwtVerify(access_token, new TextEncoder().encode(process.env.SECRET_KEY))

        const role = payload.role

        // Allow auth routes to be accessed (prevent redirect loop)
        if (pathname.startsWith('/auth')) {
            // Only redirect if user is trying to access login/register while already logged in
            if (pathname === '/auth/login' || pathname === '/auth/register') {
                return NextResponse.redirect(new URL(role === 'admin' ? ADMIN_DASHBOARD : USER_DASHBOARD, request.nextUrl))
            }
            return NextResponse.next()
        }
        
        // protect admin route
        if(pathname.startsWith('/admin') && role !== 'admin') {
            return NextResponse.redirect(new URL(WEBSITE_LOGIN, request.nextUrl))
        }

        // protect user route - allow both 'user' and 'admin' roles to access /my-account
        if (pathname.startsWith('/my-account') && role !== 'user' && role !== 'admin') {
            return NextResponse.redirect(new URL(WEBSITE_LOGIN, request.nextUrl))
        }
        
        return NextResponse.next()

    } catch (error) {
        // If token verification fails, redirect to login
        // But allow auth routes to prevent infinite loops
        if (pathname.startsWith('/auth')) {
            return NextResponse.next()
        }
        return NextResponse.redirect(new URL(WEBSITE_LOGIN, request.nextUrl))
    }
}

export const config = {
    matcher: ['/admin/:path*', '/my-account/:path*', '/auth/:path*']
}
