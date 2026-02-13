import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Job from '@/models/Job';

export async function GET() {
    await dbConnect();
    const jobs = await Job.find({}).sort({ createdAt: -1 });
    return NextResponse.json(jobs);
}

export async function POST(request) {
    await dbConnect();
    const body = await request.json();

    const job = await Job.create(body);

    return NextResponse.json({ success: true, data: job });
}
