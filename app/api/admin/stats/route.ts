import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { apiError } from '@/lib/api';
import User from '@/models/User';
import Listing from '@/models/Listing';
import Report from '@/models/Report';

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // These counts are internal business metrics — they were previously readable
    // by anyone who knew the URL.
    const admin = await requireAdmin();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const users = await User.countDocuments();
    const pendingListings = await Listing.countDocuments({ status: 'pending' });
    const totalListings = await Listing.countDocuments();
    const reports = await Report.countDocuments({ status: 'pending' });

    return NextResponse.json({ users, pendingListings, totalListings, reports });
  } catch (err) {
    return apiError('Failed to fetch stats', 500, err);
  }
}
