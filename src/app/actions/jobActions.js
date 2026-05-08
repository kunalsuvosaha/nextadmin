'use server';

import dbConnect from '@/lib/mongodb';
import Job from '@/models/Job';

export async function getPublicJobs(skip = 0, limit = 10) {
  try {
    await dbConnect();
    
    // Fetch active jobs sorted by newest first
    const jobs = await Job.find({ status: true })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Convert MongoDB _id to string so it can be passed to client components
    return jobs.map(job => ({
      ...job,
      _id: job._id.toString(),
      // Ensure createdAt is a string to avoid serialization issues
      createdAt: job.createdAt ? job.createdAt.toISOString() : new Date().toISOString()
    }));
  } catch (error) {
    console.error("Failed to fetch jobs:", error);
    return [];
  }
}
