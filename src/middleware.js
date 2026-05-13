import { NextResponse } from 'next/server';
import { ADMIN_AUTH_COOKIE, verifyAdminToken } from '@/lib/auth';

export async function middleware(request) {
    const { pathname } = request.nextUrl;

    // Check if it's an admin route or admin API route
    const isAdminRoute = pathname.startsWith('/admin');
    const isAdminApiRoute = pathname.startsWith('/api/admin');

    // Exclude auth routes from protection
    if (
        pathname === '/admin/login' ||
        pathname === '/admin/register' ||
        pathname === '/api/auth/login' ||
        pathname === '/api/auth/register' ||
        pathname === '/api/admin/logout'
    ) {
        return NextResponse.next();
    }

    if (isAdminRoute || isAdminApiRoute) {
        const adminToken = request.cookies.get(ADMIN_AUTH_COOKIE)?.value;
        const payload = await verifyAdminToken(adminToken);

        if (!payload) {
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
