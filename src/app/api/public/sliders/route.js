import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Slider from '@/models/Slider';

export async function GET() {
    await dbConnect();
    // Filter only active sliders
    const activeSliders = await Slider.find({ status: true });
    return NextResponse.json(activeSliders);
}
