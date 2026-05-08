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
  const [selectedJob, setSelectedJob] = useState(null);

  const handleApply = () => {
    alert("Application system is currently under development. Please check back later!");
  };

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

              <button 
                className={styles.viewBtn}
                onClick={() => setSelectedJob(job)}
              >
                Full View
              </button>
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

      {/* Full View Modal */}
      {selectedJob && (
        <div className={styles.modalOverlay} onClick={() => setSelectedJob(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h3 className={styles.modalTitle}>{selectedJob.title}</h3>
                <div style={{ color: '#64748b', fontSize: '0.9rem' }}>
                  Posted {timeAgo(selectedJob.createdAt)}
                </div>
              </div>
              <button className={styles.closeModalBtn} onClick={() => setSelectedJob(null)}>
                &times;
              </button>
            </div>

            <div className={styles.modalBody}>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                {selectedJob.designation && <span className={styles.tag}>{selectedJob.designation}</span>}
                {selectedJob.location && <span className={styles.tag}>{selectedJob.location}</span>}
                {selectedJob.salary && <span className={styles.tag}>₹ {selectedJob.salary} / month</span>}
                {selectedJob.jobType && <span className={styles.tag}>{selectedJob.jobType}</span>}
              </div>

              <h4 className={styles.modalSectionTitle}>Job Description</h4>
              <div className={styles.modalDescription}>
                {selectedJob.description || "No detailed description provided for this role."}
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.cancelBtn} onClick={() => setSelectedJob(null)}>
                Close
              </button>
              <button className={styles.applyBtn} onClick={handleApply}>
                Apply Now
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
