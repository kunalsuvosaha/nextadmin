import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Media from '@/models/Media';
import cloudinary from '@/lib/cloudinary';

export async function DELETE(request, { params }) {
    await dbConnect();
    const { id } = await params;

    const media = await Media.findById(id);

    if (!media) {
        return NextResponse.json({ success: false, message: 'Media not found' }, { status: 404 });
    }

    // Delete from Cloudinary
    if (media.publicId) {
        // Must specify resource_type for videos
        const resourceType = media.type === 'video' ? 'video' : 'image';
        await cloudinary.uploader.destroy(media.publicId, { resource_type: resourceType });
    }

    await Media.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
}
