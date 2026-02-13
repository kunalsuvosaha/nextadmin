import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Job from '@/models/Job';

export async function POST(request) {
    await dbConnect();
    const { ids } = await request.json();

    if (!ids || !Array.isArray(ids)) {
        return NextResponse.json({ success: false, message: 'Invalid IDs' }, { status: 400 });
    }

    await Job.deleteMany({ _id: { $in: ids } });

    return NextResponse.json({ success: true, count: ids.length });
}
