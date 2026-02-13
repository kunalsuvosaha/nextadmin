'use client';
import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import styles from '../../jobs.module.css';

// Using `use(params)` for Next.js 15
export default function JobDetailPage({ params }) {
    const { id } = use(params);
    const [job, setJob] = useState(null);

    useEffect(() => {
        fetch(`/api/admin/jobs/${id}`)
            .then(res => res.json())
            .then(data => setJob(data));
    }, [id]);

    if (!job) return <div>Loading...</div>;

    return (
        <div className={styles.formContainer}>
            <div className={styles.topBar} style={{ marginBottom: '1rem' }}>
                <h3 className={styles.pageTitle}>{job.title}</h3>
                <Link href="/admin/jobs" className={styles.cancelBtn}>Back</Link>
            </div>

            <div className={styles.formGrid}>
                <div className={styles.inputGroup}>
                    <label className={styles.label}>Designation</label>
                    <div className={styles.input}>{job.designation}</div>
                </div>
                <div className={styles.inputGroup}>
                    <label className={styles.label}>Salary</label>
                    <div className={styles.input}>{job.salary}</div>
                </div>
                <div className={styles.inputGroup}>
                    <label className={styles.label}>Category</label>
                    <div className={styles.input}>{job.category}</div>
                </div>
                <div className={styles.inputGroup}>
                    <label className={styles.label}>Job Type</label>
                    <div className={styles.input}>{job.jobType}</div>
                </div>
                <div className={styles.inputGroup}>
                    <label className={styles.label}>Location</label>
                    <div className={styles.input}>{job.location}</div>
                </div>
                <div className={styles.inputGroup}>
                    <label className={styles.label}>Deadline</label>
                    <div className={styles.input}>{job.deadline}</div>
                </div>
                <div className={styles.inputGroup}>
                    <label className={styles.label}>Skill Name</label>
                    <div className={styles.input}>{job.skillName}</div>
                </div>
            </div>

            <div className={styles.inputGroup}>
                <label className={styles.label}>Description</label>
                <div className={styles.textarea} style={{ background: '#f9f9f9' }}>{job.description}</div>
            </div>
        </div>
    );
}
