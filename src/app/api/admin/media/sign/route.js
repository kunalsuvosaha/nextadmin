import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

export async function POST(request) {
    try {
        // 1. RESOLVE ENV VARS MANUALLY (Robust Fix)
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

        // 4. Generate Signature
        const timestamp = Math.round((new Date).getTime() / 1000);
        const signature = cloudinary.utils.api_sign_request({
            timestamp: timestamp,
            folder: 'nextadmin/media', // Must match the upload folder
        }, apiSecret);

        return NextResponse.json({
            signature,
            timestamp,
            cloudName,
            apiKey
        });
    } catch (error) {
        console.error("Signature API Error:", error);
        return NextResponse.json({ success: false, message: error.message || 'Server Error' }, { status: 500 });
    }
}
