import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Media from '@/models/Media';
import { v2 as cloudinary } from 'cloudinary';

export async function DELETE(request, { params }) {
    try {
        await dbConnect();
        const { id } = await params;

        const media = await Media.findById(id);

        if (!media) {
            return NextResponse.json({ success: false, message: 'Media not found' }, { status: 404 });
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
        if (media.publicId) {
            // Must specify resource_type for videos
            const resourceType = media.type === 'video' ? 'video' : 'image';
            await cloudinary.uploader.destroy(media.publicId, { resource_type: resourceType });
        }

        await Media.findByIdAndDelete(id);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Media Delete Error:", error);
        return NextResponse.json({ success: false, message: error.message || 'Server Error' }, { status: 500 });
    }
}

export async function PATCH(request, { params }) {
    try {
        await dbConnect();
        const { id } = await params;
        const { isFeatured } = await request.json();

        const media = await Media.findById(id);

        if (!media) {
            return NextResponse.json({ success: false, message: 'Media not found' }, { status: 404 });
        }

        // If trying to feature an item, check the limit
        if (isFeatured) {
            const featuredCount = await Media.countDocuments({ isFeatured: true, type: 'image' });
            if (featuredCount >= 2 && !media.isFeatured) {
                return NextResponse.json({ 
                    success: false, 
                    message: 'Maximum of 2 images can be featured on the landing page.' 
                }, { status: 400 });
            }
        }

        media.isFeatured = isFeatured;
        await media.save();

        return NextResponse.json({ success: true, data: media });
    } catch (error) {
        console.error("Media Update Error:", error);
        return NextResponse.json({ success: false, message: error.message || 'Server Error' }, { status: 500 });
    }
}
