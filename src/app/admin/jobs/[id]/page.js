'use client';
import { useState, useEffect, use } from 'react';
import JobForm from '../JobForm';

export default function EditJobPage({ params }) {
    const { id } = use(params);
    const [job, setJob] = useState(null);

    useEffect(() => {
        if (!id) return;
        fetch(`/api/admin/jobs/${id}`)
            .then(res => res.json())
            .then(data => setJob(data));
    }, [id]);

    if (!job) return <div>Loading...</div>;

    return <JobForm initialData={job} />;
}
