import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { username, password } = await request.json();

        // Check credentials
        if (username === 'admin' && password === '123') {
            const response = NextResponse.json({ success: true });
            
            // Set a session cookie (no explicit maxAge, so it lasts until the browser closes)
            response.cookies.set({
                name: 'admin_session',
                value: 'authenticated',
                httpOnly: true,
                path: '/',
                sameSite: 'lax',
                // secure: process.env.NODE_ENV === 'production', // uncomment if deploying with HTTPS
            });

            return response;
        } else {
            return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
        }
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}
