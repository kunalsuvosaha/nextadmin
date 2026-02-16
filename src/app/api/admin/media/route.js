import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Media from '@/models/Media';
import { v2 as cloudinary } from 'cloudinary';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await dbConnect();
        const media = await Media.find({}).sort({ createdAt: -1 });
        return NextResponse.json(media);
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        await dbConnect();

        // 1. RESOLVE ENV VARS MANUALLY
        const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        const apiKey = process.env.CLOUDINARY_API_KEY || process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
        const apiSecret = process.env.CLOUDINARY_API_SECRET || process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET;

        // 2. FAIL FAST IF MISSING
        if (!cloudName) return NextResponse.json({ success: false, message: 'CRITICAL: Cloud Name is Missing' }, { status: 500 });
        if (!apiKey) return NextResponse.json({ success: false, message: 'CRITICAL: API Key is Missing' }, { status: 500 });
        if (!apiSecret) return NextResponse.json({ success: false, message: 'CRITICAL: API Secret is Missing' }, { status: 500 });

        // 3. CONFIGURE CLOUDINARY EXPLICITLY HERE
        cloudinary.config({
            cloud_name: cloudName,
            api_key: apiKey,
            api_secret: apiSecret
        });

        const contentType = request.headers.get('content-type') || '';

        if (contentType.includes('multipart/form-data')) {
            // (Legacy/Small File Upload Logic)
            const data = await request.formData();
            const file = data.get('file');

            if (!file) {
                return NextResponse.json({ success: false, message: 'Missing file' }, { status: 400 });
            }

            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            // Normalize type to lowercase for consistency
            const typeLower = file.type.startsWith('video') ? 'video' : 'image';

            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: 'nextadmin/media',
                        resource_type: 'auto'
                    },
                    (error, result) => {
                        if (error) {
                            console.error("Cloudinary Error:", error);
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    }
                );
                uploadStream.end(buffer);
            });

            const newMedia = await Media.create({
                name: file.name,
                url: result.secure_url,
                publicId: result.public_id,
                type: typeLower,
            });

            return NextResponse.json({ success: true, data: newMedia });

        } else if (contentType.includes('application/json')) {
            // NEW: Handle JSON payload from Client-Side Upload
            const body = await request.json();
            const { name, url, publicId, type } = body;

            if (!name || !url || !publicId || !type) {
                return NextResponse.json({ success: false, message: 'Missing metadata fields' }, { status: 400 });
            }

            // Normalize type to lowercase for consistency
            const typeLower = type.toLowerCase();

            const newMedia = await Media.create({
                name,
                url,
                publicId,
                type: typeLower
            });

            return NextResponse.json({ success: true, data: newMedia });
        } else {
            return NextResponse.json({ success: false, message: 'Invalid content type' }, { status: 400 });
        }

    } catch (error) {
        console.error("Upload API Error:", error);
        return NextResponse.json({ success: false, message: error.message || 'Server Error' }, { status: 500 });
    }
}
