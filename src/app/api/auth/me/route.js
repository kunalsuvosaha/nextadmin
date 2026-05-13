import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { ADMIN_AUTH_COOKIE, verifyAdminToken } from '@/lib/auth';
import Admin from '@/models/Admin';

export async function GET() {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_AUTH_COOKIE)?.value;
    const payload = await verifyAdminToken(token);

    if (!payload) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const admin = await Admin.findById(payload.id).select('name email role');

    if (!admin) {
        return NextResponse.json({ success: false, message: 'Admin not found' }, { status: 404 });
    }

    return NextResponse.json({
        success: true,
        admin: {
            name: admin.name,
            email: admin.email,
            role: admin.role,
        },
    });
}
