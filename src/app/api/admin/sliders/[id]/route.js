import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Slider from '@/models/Slider';
import cloudinary from '@/lib/cloudinary';

export async function DELETE(request, { params }) {
    await dbConnect();
    const { id } = await params;

    const slider = await Slider.findById(id);

    if (!slider) {
        return NextResponse.json({ success: false, message: 'Slider not found' }, { status: 404 });
    }

    // Delete from Cloudinary
    if (slider.publicId) {
        await cloudinary.uploader.destroy(slider.publicId);
    }

    await Slider.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
}

export async function PATCH(request, { params }) {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    const slider = await Slider.findById(id);

    if (!slider) {
        return NextResponse.json({ success: false, message: 'Slider not found' }, { status: 404 });
    }

    // If activating a slider, deactivate all others
    if (status === true) {
        await Slider.updateMany({ _id: { $ne: id } }, { status: false });
    }

    const updatedSlider = await Slider.findByIdAndUpdate(
        id,
        { status },
        { new: true }
    );

    return NextResponse.json({ success: true, data: updatedSlider });
}
