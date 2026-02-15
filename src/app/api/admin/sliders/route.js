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

        // STRICT DEBUGGING: Check Env Vars
        const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        const apiKey = process.env.CLOUDINARY_API_KEY || process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
        const apiSecret = process.env.CLOUDINARY_API_SECRET || process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET;

        // If missing, return exact error to Frontend Alert
        if (!cloudName) return NextResponse.json({ success: false, message: 'CRITICAL: Cloud Name is Mising in Vercel Env' }, { status: 500 });
        if (!apiKey) return NextResponse.json({ success: false, message: 'CRITICAL: API Key is Missing in Vercel Env' }, { status: 500 });
        if (!apiSecret) return NextResponse.json({ success: false, message: 'CRITICAL: API Secret is Missing in Vercel Env' }, { status: 500 });

        console.log("Upload Request Started with Cloud Name:", cloudName);

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
