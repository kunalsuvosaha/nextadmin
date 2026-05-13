import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Admin from '@/models/Admin';

export async function POST(request) {
    try {
        const { name, email, password, passkey } = await request.json();

        if (!process.env.ADMIN_CREATION_KEY) {
            return NextResponse.json(
                { success: false, message: 'Admin creation is not configured' },
                { status: 500 }
            );
        }

        if (passkey !== process.env.ADMIN_CREATION_KEY) {
            return NextResponse.json(
                { success: false, message: 'Invalid company passkey' },
                { status: 403 }
            );
        }

        if (!name || !email || !password) {
            return NextResponse.json(
                { success: false, message: 'Name, email, and password are required' },
                { status: 400 }
            );
        }

        if (password.length < 8) {
            return NextResponse.json(
                { success: false, message: 'Password must be at least 8 characters' },
                { status: 400 }
            );
        }

        await dbConnect();

        const normalizedEmail = email.toLowerCase().trim();
        const existingAdmin = await Admin.findOne({ email: normalizedEmail });

        if (existingAdmin) {
            return NextResponse.json(
                { success: false, message: 'Admin already exists' },
                { status: 409 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        await Admin.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            role: 'admin',
        });

        return NextResponse.json(
            { success: true, message: 'Admin registered successfully' },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Registration failed' },
            { status: 500 }
        );
    }
}
