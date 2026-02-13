import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Job from '@/models/Job';

export async function GET(request, { params }) {
    await dbConnect();
    const { id } = await params;

    // Validate MongoDB ID format to prevent crashes
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return NextResponse.json({ success: false, message: 'Invalid ID format' }, { status: 400 });
    }

    const job = await Job.findById(id);

    if (!job) {
        return NextResponse.json({ success: false, message: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json(job);
}

export async function PUT(request, { params }) {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();

    const job = await Job.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true,
    });

    if (!job) {
        return NextResponse.json({ success: false, message: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: job });
}

export async function DELETE(request, { params }) {
    await dbConnect();
    const { id } = await params;

    const job = await Job.findByIdAndDelete(id);

    if (!job) {
        return NextResponse.json({ success: false, message: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
}
