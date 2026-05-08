'use client';
import { useState } from 'react';
import { getPublicJobs } from '@/app/actions/jobActions';
import styles from './JobSection.module.css';

// Helper function to calculate relative time
function timeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + ' years ago';
  
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + ' months ago';
  
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + ' days ago';
  
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + ' hours ago';
  
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + ' minutes ago';
  
  return Math.floor(seconds) + ' seconds ago';
}

export default function JobSection({ initialJobs }) {
  const [jobs, setJobs] = useState(initialJobs);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialJobs.length === 10);
  const [page, setPage] = useState(1);

  const loadMoreJobs = async () => {
    setLoading(true);
    const skip = page * 10;
    const newJobs = await getPublicJobs(skip, 10);
    
    if (newJobs.length > 0) {
      setJobs(prevJobs => [...prevJobs, ...newJobs]);
      setPage(prevPage => prevPage + 1);
    }
    
    // If we received fewer than 10 jobs, there are no more to load
    if (newJobs.length < 10) {
      setHasMore(false);
    }
    
    setLoading(false);
  };

  if (jobs.length === 0) {
    return null; // Don't render the section if there are no jobs at all
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>Latest Opportunities</h2>
        
        <div className={styles.grid}>
          {jobs.map((job) => (
            <div key={job._id} className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.jobTitle}>{job.title}</h3>
                <span className={styles.timeAgo}>{timeAgo(job.createdAt)}</span>
              </div>
              
              <div className={styles.details}>
                {job.designation && (
                  <div className={styles.detailRow}>
                    <strong>Role:</strong> {job.designation}
                  </div>
                )}
                {job.location && (
                  <div className={styles.detailRow}>
                    <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.242-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    {job.location}
                  </div>
                )}
                {job.salary && (
                  <div className={styles.detailRow}>
                    <span style={{ fontWeight: 'bold', color: '#94a3b8', fontSize: '1.1em' }}>₹</span>
                    {job.salary} per month
                  </div>
                )}
              </div>
              
              <div className={styles.tags}>
                {job.jobType && <span className={styles.tag}>{job.jobType}</span>}
                {job.category && <span className={styles.tag}>{job.category}</span>}
              </div>
            </div>
          ))}
        </div>

        {hasMore && (
          <div className={styles.loadMoreContainer}>
            <button 
              className={styles.loadMoreBtn} 
              onClick={loadMoreJobs}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'See More'}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
