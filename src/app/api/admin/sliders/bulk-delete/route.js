import { NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/db';
import { join } from 'path';
import { unlink } from 'fs/promises';
import fs from 'fs';

export async function POST(request) {
    const body = await request.json();
    const { ids } = body;

    if (!ids || !Array.isArray(ids)) {
        return NextResponse.json({ success: false, message: 'Invalid IDs' }, { status: 400 });
    }

    let sliders = readData('sliders');
    const slidersToDelete = sliders.filter(s => ids.includes(s.id));

    // Delete files
    for (const slider of slidersToDelete) {
        if (slider.imageUrl) {
            const filePath = join(process.cwd(), 'public', slider.imageUrl);
            if (fs.existsSync(filePath)) {
                try {
                    await unlink(filePath);
                } catch (e) {
                    console.error('Failed to delete file', filePath);
                }
            }
        }
    }

    const remainingSliders = sliders.filter(s => !ids.includes(s.id));
    writeData('sliders', remainingSliders);

    return NextResponse.json({ success: true, count: ids.length });
}
