import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Slider from '@/models/Slider';
import { v2 as cloudinary } from 'cloudinary';

export async function DELETE(request, { params }) {
    try {
        await dbConnect();
        const { id } = await params;

        const slider = await Slider.findById(id);

        if (!slider) {
            return NextResponse.json({ success: false, message: 'Slider not found' }, { status: 404 });
        }

        // Configure Cloudinary Inline
        const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        const apiKey = process.env.CLOUDINARY_API_KEY || process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
        const apiSecret = process.env.CLOUDINARY_API_SECRET || process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET;

        cloudinary.config({
            cloud_name: cloudName,
            api_key: apiKey,
            api_secret: apiSecret
        });

        // Delete from Cloudinary
        if (slider.publicId) {
            await cloudinary.uploader.destroy(slider.publicId);
        }

        await Slider.findByIdAndDelete(id);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Slider Delete Error:", error);
        return NextResponse.json({ success: false, message: error.message || 'Server Error' }, { status: 500 });
    }
}

export async function PATCH(request, { params }) {
    try {
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
    } catch (error) {
        console.error("Slider Patch Error:", error);
        return NextResponse.json({ success: false, message: error.message || 'Server Error' }, { status: 500 });
    }
}
