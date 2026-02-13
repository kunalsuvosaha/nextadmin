'use client';
import { useState, useEffect } from 'react';
import styles from './slider.module.css';

export default function SliderPage() {
    const [sliders, setSliders] = useState([]);
    const [name, setName] = useState('');
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);

    useEffect(() => {
        fetchSliders();
    }, []);

    async function fetchSliders() {
        const res = await fetch('/api/admin/sliders');
        const data = await res.json();
        setSliders(data);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!file || !name) return alert('Please provide name and file');

        const formData = new FormData();
        formData.append('name', name);
        formData.append('file', file);

        setLoading(true);
        const res = await fetch('/api/admin/sliders', {
            method: 'POST',
            body: formData,
        });
        setLoading(false);

        if (res.ok) {
            setName('');
            setFile(null);
            // Reset file input value
            document.getElementById('fileInput').value = '';
            fetchSliders();
        } else {
            alert('Failed to upload');
        }
    }

    async function handleDelete(id) {
        if (!confirm('Are you sure?')) return;
        const res = await fetch(`/api/admin/sliders/${id}`, { method: 'DELETE' });
        if (res.ok) fetchSliders();
    }

    async function toggleStatus(id, currentStatus) {
        const res = await fetch(`/api/admin/sliders/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({ status: !currentStatus }),
            headers: { 'Content-Type': 'application/json' }
        });
        if (res.ok) fetchSliders();
    }

    async function handleBulkDelete() {
        if (selectedIds.length === 0) return;
        if (!confirm(`Delete ${selectedIds.length} items?`)) return;

        const res = await fetch('/api/admin/sliders/bulk-delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids: selectedIds })
        });

        if (res.ok) {
            setSelectedIds([]);
            fetchSliders();
        }
    }

    function handleSelect(id) {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(i => i !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    }

    return (
        <div>
            <h2 style={{ marginBottom: '1rem' }}>Slider</h2>

            {/* Create Form */}
            <div className={styles.topBar}>
                <input
                    type="text"
                    placeholder="Slider Name"
                    className={styles.input}
                    value={name}
                    onChange={e => setName(e.target.value)}
                    style={{ flex: 1 }}
                />
                <input
                    id="fileInput"
                    type="file"
                    className={styles.fileInput}
                    onChange={e => setFile(e.target.files[0])}
                    accept="image/*"
                    style={{ flex: 1 }}
                />
                <button className={styles.submitBtn} onClick={handleSubmit} disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit'}
                </button>
                {selectedIds.length > 0 && (
                    <button className={styles.deleteBtn} onClick={handleBulkDelete}>
                        Delete Selected ({selectedIds.length})
                    </button>
                )}
            </div>

            {/* Grid */}
            <div className={styles.grid}>
                {sliders.map(slider => (
                    <div key={slider._id || slider.id} className={styles.card}>
                        <div className={styles.cardMediaWrapper}>
                            <img src={slider.imageUrl} alt={slider.name} className={styles.cardMedia} />
                            <div className={styles.checkboxWrapper}>
                                <input
                                    type="checkbox"
                                    className={styles.checkbox}
                                    checked={selectedIds.includes(slider._id || slider.id)}
                                    onChange={() => handleSelect(slider._id || slider.id)}
                                />
                            </div>
                        </div>
                        <div className={styles.cardBody}>
                            <div className={styles.row}>
                                <span className={styles.label}>Name</span>
                                <span className={styles.val}>{slider.name}</span>
                            </div>
                            <div className={styles.row}>
                                <span className={styles.label}>Status</span>
                                <label className={styles.toggle}>
                                    <input
                                        type="checkbox"
                                        checked={slider.status}
                                        onChange={() => toggleStatus(slider._id || slider.id, slider.status)}
                                    />
                                    <span className={styles.slider}></span>
                                </label>
                            </div>
                            <div className={styles.row}>
                                <span className={styles.label}>Action</span>
                                <div className={styles.actions}>
                                    <button className={`${styles.actionBtn} ${styles.view}`}>View</button>
                                    <span>|</span>
                                    <button className={`${styles.actionBtn} ${styles.delete}`} onClick={() => handleDelete(slider._id || slider.id)}>Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination Mock */}
            <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'white', borderRadius: '8px', border: '1px solid #eee' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontWeight: 'bold', color: '#333' }}>1/20 Pages</span>
                    <button style={{ padding: '5px 15px', border: '1px solid #ddd', background: 'white', borderRadius: '4px' }}>01</button>
                    <button className={styles.submitBtn} style={{ padding: '5px 20px', minWidth: 'auto' }}>Jump</button>
                </div>

                <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                    <span style={{ color: '#999', marginRight: '10px' }}>&lt;&lt; Prev</span>
                    <button style={{ width: '30px', height: '30px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px' }}>01</button>
                    <button style={{ width: '30px', height: '30px', background: 'white', border: '1px solid #ddd', borderRadius: '4px' }}>02</button>
                    <button style={{ width: '30px', height: '30px', background: 'white', border: '1px solid #ddd', borderRadius: '4px' }}>03</button>
                    <button style={{ width: '30px', height: '30px', background: 'white', border: '1px solid #ddd', borderRadius: '4px' }}>04</button>
                    <button style={{ width: '30px', height: '30px', background: 'white', border: '1px solid #ddd', borderRadius: '4px' }}>05</button>
                    <span style={{ color: '#1a237e', marginLeft: '10px', fontWeight: 'bold' }}>Next &gt;&gt;</span>
                </div>
            </div>
        </div>
    );
}
