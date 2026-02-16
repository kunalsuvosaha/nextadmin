import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Media from '@/models/Media';
import { v2 as cloudinary } from 'cloudinary';

export async function POST(request) {
    try {
        await dbConnect();
        const { ids } = await request.json();

        // Configure Cloudinary Inline
        const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        const apiKey = process.env.CLOUDINARY_API_KEY || process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
        const apiSecret = process.env.CLOUDINARY_API_SECRET || process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET;

        cloudinary.config({
            cloud_name: cloudName,
            api_key: apiKey,
            api_secret: apiSecret
        });

        // Find all media items to delete to get their publicIds
        const mediaItems = await Media.find({ _id: { $in: ids } });

        for (const media of mediaItems) {
            if (media.publicId) {
                const resourceType = media.type === 'video' ? 'video' : 'image';
                try {
                    await cloudinary.uploader.destroy(media.publicId, { resource_type: resourceType });
                } catch (err) {
                    console.error(`Failed to delete Cloudinary media ${media._id}:`, err);
                }
            }
        }

        await Media.deleteMany({ _id: { $in: ids } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Media Bulk Delete Error:", error);
        return NextResponse.json({ success: false, message: error.message || 'Server Error' }, { status: 500 });
    }
}
