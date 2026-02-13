import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';

export async function GET() {
    try {
        await dbConnect();
        return NextResponse.json({ message: "MongoDB connected successfully" });
    } catch (error) {
        return NextResponse.json(
            { message: "MongoDB connection failed", error: error.message },
            { status: 500 }
        );
    }
}
