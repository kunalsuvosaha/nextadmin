import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Media from '@/models/Media';
import cloudinary from '@/lib/cloudinary';

export async function POST(request) {
    await dbConnect();
    const { ids } = await request.json();

    // Find all media items to delete to get their publicIds
    const mediaItems = await Media.find({ _id: { $in: ids } });

    for (const media of mediaItems) {
        if (media.publicId) {
            const resourceType = media.type === 'video' ? 'video' : 'image';
            await cloudinary.uploader.destroy(media.publicId, { resource_type: resourceType });
        }
    }

    await Media.deleteMany({ _id: { $in: ids } });

    return NextResponse.json({ success: true });
}
