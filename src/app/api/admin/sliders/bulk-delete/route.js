import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Slider from '@/models/Slider';
import { v2 as cloudinary } from 'cloudinary';

export async function POST(request) {
    try {
        await dbConnect();
        const { ids } = await request.json();

        if (!ids || !Array.isArray(ids)) {
            return NextResponse.json({ success: false, message: 'Invalid IDs' }, { status: 400 });
        }

        // 1. Configure Cloudinary Inline
        const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        const apiKey = process.env.CLOUDINARY_API_KEY || process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
        const apiSecret = process.env.CLOUDINARY_API_SECRET || process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET;

        cloudinary.config({
            cloud_name: cloudName,
            api_key: apiKey,
            api_secret: apiSecret
        });

        // 2. Find items to get Public IDs
        const sliders = await Slider.find({ _id: { $in: ids } });

        // 3. Delete from Cloudinary
        for (const slider of sliders) {
            if (slider.publicId) {
                try {
                    await cloudinary.uploader.destroy(slider.publicId);
                } catch (err) {
                    console.error(`Failed to delete Cloudinary image for slider ${slider._id}:`, err);
                }
            }
        }

        // 4. Delete from MongoDB
        await Slider.deleteMany({ _id: { $in: ids } });

        return NextResponse.json({ success: true, count: ids.length });
    } catch (error) {
        console.error("Slider Bulk Delete Error:", error);
        return NextResponse.json({ success: false, message: error.message || 'Server Error' }, { status: 500 });
    }
}
