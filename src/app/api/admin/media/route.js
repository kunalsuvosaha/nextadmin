import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Media from '@/models/Media';
import cloudinary from '@/lib/cloudinary';

export async function GET() {
    await dbConnect();
    const media = await Media.find({}).sort({ createdAt: -1 });
    return NextResponse.json(media);
}

export async function POST(request) {
    await dbConnect();
    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
        const data = await request.formData();
        const file = data.get('file');

        if (!file) {
            return NextResponse.json({ success: false, message: 'Missing file' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Determine type (image or video)
        const type = file.type.startsWith('video') ? 'video' : 'image';

        // Upload to Cloudinary
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'nextadmin/media',
                    resource_type: 'auto' // Auto-detect image or video
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            uploadStream.end(buffer);
        });

        const newMedia = await Media.create({
            name: file.name,
            url: result.secure_url,
            publicId: result.public_id,
            type: type,
        });

        return NextResponse.json({ success: true, data: newMedia });
    } else {
        return NextResponse.json({ success: false, message: 'Invalid content type' }, { status: 400 });
    }
}
