import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import Listing from '@/models/Listing';
import Report from '@/models/Report';

export async function GET() {
  try {
    await connectDB();
    const users = await User.countDocuments();
    const pendingListings = await Listing.countDocuments({ status: 'pending' });
    const totalListings = await Listing.countDocuments();
    const reports = await Report.countDocuments({ status: 'pending' });

    return NextResponse.json({ users, pendingListings, totalListings, reports });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
