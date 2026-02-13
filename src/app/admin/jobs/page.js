'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './jobs.module.css';

export default function JobsPage() {
    const [jobs, setJobs] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);

    useEffect(() => {
        fetchJobs();
    }, []);

    async function fetchJobs() {
        const res = await fetch('/api/admin/jobs');
        const data = await res.json();
        setJobs(data);
    }

    async function toggleStatus(id, currentStatus) {
        const res = await fetch(`/api/admin/jobs/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({ status: !currentStatus }),
            headers: { 'Content-Type': 'application/json' }
        });
        if (res.ok) fetchJobs();
    }

    async function handleDelete(id) {
        if (!confirm('Are you sure?')) return;
        const res = await fetch(`/api/admin/jobs/${id}`, { method: 'DELETE' });
        if (res.ok) fetchJobs();
    }

    async function handleBulkDelete() {
        if (selectedIds.length === 0) return;
        if (!confirm(`Delete ${selectedIds.length} items?`)) return;

        const res = await fetch('/api/admin/jobs/bulk-delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids: selectedIds })
        });

        if (res.ok) {
            setSelectedIds([]);
            fetchJobs();
        }
    }

    function handleSelect(id) {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(i => i !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    }

    function handleSelectAll(e) {
        if (e.target.checked) {
            setSelectedIds(jobs.map(j => j.id));
        } else {
            setSelectedIds([]);
        }
    }

    return (
        <div>
            <div className={styles.topBar}>
                <h2 className={styles.pageTitle}>All Live Jobs</h2>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    {selectedIds.length > 0 && (
                        <button onClick={handleBulkDelete} className={styles.deleteBtn}>
                            Delete Selected ({selectedIds.length})
                        </button>
                    )}
                    <Link href="/admin/jobs/new" className={styles.addBtn}>Add/Post a Job</Link>
                </div>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th><input type="checkbox" onChange={handleSelectAll} checked={jobs.length > 0 && selectedIds.length === jobs.length} /></th>
                            <th>Enter Job Title</th>
                            <th>Designation</th>
                            <th>Salary</th>
                            <th>Category</th>
                            <th>Job Type</th>
                            <th>Location</th>
                            <th>Deadline</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {jobs.map(job => (
                            <tr key={job._id || job.id}>
                                <td><input type="checkbox" checked={selectedIds.includes(job._id || job.id)} onChange={() => handleSelect(job._id || job.id)} /></td>
                                <td>{job.title}</td>
                                <td>{job.designation}</td>
                                <td>{job.salary}</td>
                                <td>{job.category}</td>
                                <td>{job.jobType}</td>
                                <td>{job.location}</td>
                                <td>{job.deadline}</td>
                                <td>
                                    <div className={styles.actions}>
                                        <Link href={`/admin/jobs/${job._id || job.id}/view`} className={`${styles.actionLink} ${styles.view}`}>View</Link>
                                        <span>|</span>
                                        <Link href={`/admin/jobs/${job._id || job.id}`} className={`${styles.actionLink} ${styles.edit}`}>Edit</Link>
                                        <span>|</span>
                                        <button className={`${styles.actionLink} ${styles.delete}`} onClick={() => handleDelete(job._id || job.id)}>Delete</button>
                                        <label className={styles.statusToggle} style={{ marginLeft: '10px' }}>
                                            <input
                                                type="checkbox"
                                                className={styles.inputCheckbox}
                                                checked={job.status}
                                                onChange={() => toggleStatus(job.id, job.status)}
                                            />
                                            <span className={styles.slider}></span>
                                        </label>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {jobs.length === 0 && (
                            <tr>
                                <td colSpan="9" style={{ textAlign: 'center' }}>No jobs found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Mock */}
            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'white', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontWeight: '600', color: '#333' }}>1/20 Pages</span>
                    <button style={{ padding: '5px 15px', border: '1px solid #ddd', background: 'white', borderRadius: '4px', cursor: 'pointer' }}>01</button>
                    <button className={styles.submitBtn} style={{ padding: '5px 20px', minWidth: 'auto', margin: 0 }}>Jump</button>
                </div>

                <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                    <span style={{ color: '#9ca3af', marginRight: '10px', fontSize: '0.9rem' }}>&lt;&lt; Prev</span>
                    <button style={{ width: '30px', height: '30px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>01</button>
                    <button style={{ width: '30px', height: '30px', background: 'white', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}>02</button>
                    <button style={{ width: '30px', height: '30px', background: 'white', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}>03</button>
                    <button style={{ width: '30px', height: '30px', background: 'white', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}>04</button>
                    <button style={{ width: '30px', height: '30px', background: 'white', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}>05</button>
                    <span style={{ color: '#1e3a8a', marginLeft: '10px', fontWeight: '600', fontSize: '0.9rem' }}>Next &gt;&gt;</span>
                </div>
            </div>
        </div>
    );
}
