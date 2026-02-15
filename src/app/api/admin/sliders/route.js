import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Slider from '@/models/Slider';
import cloudinary from '@/lib/cloudinary';

export async function GET() {
    await dbConnect();
    const sliders = await Slider.find({}).sort({ createdAt: -1 });
    return NextResponse.json(sliders);
}

export async function POST(request) {
    try {
        await dbConnect();

        console.log("Upload Request Started");
        console.log("Cloud Name exists:", !!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME);
        console.log("API Key exists:", !!process.env.CLOUDINARY_API_KEY);
        console.log("API Secret exists:", !!process.env.CLOUDINARY_API_SECRET);

        const data = await request.formData();
        const file = data.get('file');
        const name = data.get('name');

        if (!file || !name) {
            return NextResponse.json({ success: false, message: 'Missing file or name' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload to Cloudinary via stream
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: 'nextadmin/sliders' },
                (error, result) => {
                    if (error) {
                        console.error("Cloudinary Upload Error:", error);
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            );
            uploadStream.end(buffer);
        });

        const newSlider = await Slider.create({
            name,
            imageUrl: result.secure_url,
            publicId: result.public_id,
            status: true,
        });

        return NextResponse.json({ success: true, data: newSlider });
    } catch (error) {
        console.error("Slider Upload API Error:", error);
        return NextResponse.json({ success: false, message: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
