import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { setAdminAuthCookie, signAdminToken } from '@/lib/auth';
import Admin from '@/models/Admin';

export async function POST(request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { success: false, message: 'Email and password are required' },
                { status: 400 }
            );
        }

        await dbConnect();

        const admin = await Admin.findOne({ email: email.toLowerCase().trim() });

        if (!admin) {
            return NextResponse.json(
                { success: false, message: 'Invalid credentials' },
                { status: 401 }
            );
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password);

        if (!isPasswordValid) {
            return NextResponse.json(
                { success: false, message: 'Invalid credentials' },
                { status: 401 }
            );
        }

        const token = await signAdminToken(admin);
        const response = NextResponse.json({
            success: true,
            admin: {
                id: admin._id.toString(),
                name: admin.name,
                email: admin.email,
                role: admin.role,
            },
        });

        setAdminAuthCookie(response, token);

        return response;
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Login failed' },
            { status: 500 }
        );
    }
}
