import { NextResponse } from 'next/server';

export function middleware(request) {
    const { pathname } = request.nextUrl;

    // Check if it's an admin route or admin API route
    const isAdminRoute = pathname.startsWith('/admin');
    const isAdminApiRoute = pathname.startsWith('/api/admin');

    // Exclude login routes from protection
    if (pathname === '/admin/login' || pathname === '/api/admin/login' || pathname === '/api/admin/logout') {
        return NextResponse.next();
    }

    if (isAdminRoute || isAdminApiRoute) {
        // Check for the admin session cookie
        const adminToken = request.cookies.get('admin_session');

        if (!adminToken || adminToken.value !== 'authenticated') {
            // If accessing an API route, return 401
            if (isAdminApiRoute) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
            // If accessing a frontend route, redirect to login
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/api/admin/:path*'],
};
