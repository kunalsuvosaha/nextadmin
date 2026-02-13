'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './jobs.module.css';

export default function JobForm({ initialData = {} }) {
    const router = useRouter();
    const isEdit = !!initialData.id;
    const [formData, setFormData] = useState({
        title: '',
        designation: '',
        salary: '',
        category: '',
        jobType: '',
        location: '',
        deadline: '',
        skillName: '',
        description: '',
        imageUrl: '', // Optional
        ...initialData
    });

    const [loading, setLoading] = useState(false);

    function handleChange(e) {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);

        const url = isEdit ? `/api/admin/jobs/${initialData.id}` : '/api/admin/jobs';
        const method = isEdit ? 'PUT' : 'POST';

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        setLoading(false);

        if (res.ok) {
            router.push('/admin/jobs');
            router.refresh();
        } else {
            alert('Failed to save job');
        }
    }

    return (
        <div className={styles.formContainer}>
            <h3 className={styles.pageTitle} style={{ marginBottom: '1.5rem' }}>
                {isEdit ? 'Edit Job Details' : 'Add Job Details'}
            </h3>
            <form onSubmit={handleSubmit}>
                <div className={styles.formGrid}>
                    <input className={styles.input} name="title" placeholder="Enter Job Title" value={formData.title} onChange={handleChange} required />
                    <input className={styles.input} name="designation" placeholder="Designation" value={formData.designation} onChange={handleChange} required />
                    <input className={styles.input} name="salary" placeholder="Salary" value={formData.salary} onChange={handleChange} />
                    <input className={styles.input} name="category" placeholder="Category" value={formData.category} onChange={handleChange} />
                    <input className={styles.input} name="jobType" placeholder="Job Type" value={formData.jobType} onChange={handleChange} />
                    <input className={styles.input} name="location" placeholder="Location" value={formData.location} onChange={handleChange} />
                    {/* Using text for date to match screenshot or date input */}
                    <input className={styles.input} name="deadline" type="date" placeholder="Deadline" value={formData.deadline} onChange={handleChange} />
                    <input className={styles.input} name="skillName" placeholder="Skill Name" value={formData.skillName} onChange={handleChange} />
                    <input className={styles.input} name="imageUrl" placeholder="Choose Image (URL or Name)" value={formData.imageUrl} onChange={handleChange} />
                </div>
                <textarea
                    className={styles.textarea}
                    name="description"
                    placeholder="Full job details..."
                    value={formData.description}
                    onChange={handleChange}
                ></textarea>
                <div style={{ marginTop: '2rem' }}>
                    <button type="submit" className={styles.submitBtn} disabled={loading}>
                        {loading ? 'Submitting...' : 'Submit'}
                    </button>
                    <button type="button" className={styles.cancelBtn} onClick={() => router.back()}>Cancel</button>
                </div>
            </form>
        </div>
    );
}
