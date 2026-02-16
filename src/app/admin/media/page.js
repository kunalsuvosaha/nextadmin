'use client';
import { useState, useEffect } from 'react';
import styles from './media.module.css';

export default function MediaPage() {
    const [mediaItems, setMediaItems] = useState([]);
    const [type, setType] = useState('IMAGE'); // 'IMAGE' or 'VIDEO'
    const [name, setName] = useState('');
    const [url, setUrl] = useState(''); // For video
    const [file, setFile] = useState(null); // For image
    const [loading, setLoading] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);

    useEffect(() => {
        fetchMedia();
    }, []);

    async function handleBulkDelete() {
        if (selectedIds.length === 0) return;
        if (!confirm(`Delete ${selectedIds.length} items?`)) return;

        const res = await fetch('/api/admin/media/bulk-delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids: selectedIds })
        });

        if (res.ok) {
            setSelectedIds([]);
            fetchMedia();
        }
    }

    function handleSelect(id) {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(i => i !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    }

    async function fetchMedia() {
        // Add timestamp to prevent caching
        const res = await fetch(`/api/admin/media?t=${Date.now()}`);
        const data = await res.json();
        setMediaItems(data);
    }

    async function handleSubmit() {
        if (!name) return alert('Name is required');
        if (!file && !url) return alert('File or URL is required');

        setLoading(true);

        try {
            // IF FILE: Upload to Cloudinary CLIENT-SIDE (Bypasses Vercel 4.5MB limit)
            let finalUrl = url;
            let finalPublicId = '';
            let finalType = type;

            if (file) {
                // 1. Get Signature from backend
                const signRes = await fetch('/api/admin/media/sign', { method: 'POST' });
                if (!signRes.ok) throw new Error('Failed to get upload signature');
                const signData = await signRes.json();

                const { signature, timestamp, cloudName, apiKey } = signData;

                if (!cloudName || !apiKey || !signature) {
                    throw new Error("Missing config from signature API");
                }

                // 2. Upload to Cloudinary directly
                const formData = new FormData();
                formData.append('file', file);
                formData.append('api_key', apiKey);
                formData.append('timestamp', timestamp);
                formData.append('signature', signature);
                formData.append('folder', 'nextadmin/media');

                // Determine resource type based on file (video vs image)
                const resourceType = file.type.startsWith('video') ? 'video' : 'image';

                const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, {
                    method: 'POST',
                    body: formData
                });

                if (!uploadRes.ok) {
                    const error = await uploadRes.json();
                    throw new Error(error.message || 'Cloudinary Upload Failed');
                }

                const uploadData = await uploadRes.json();
                finalUrl = uploadData.secure_url;
                finalPublicId = uploadData.public_id;
                finalType = resourceType === 'video' ? 'video' : 'image'; // Store lowercase
            }

            // 3. Save Metadata to DB (Backend)
            const saveRes = await fetch('/api/admin/media', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    url: finalUrl,
                    publicId: finalPublicId,
                    type: finalType.toLowerCase() // Ensure lowercase
                })
            });

            if (saveRes.ok) {
                setName('');
                setFile(null);
                setUrl('');
                const fileInput = document.getElementById('fileInput');
                if (fileInput) fileInput.value = '';
                fetchMedia();
            } else {
                const errorData = await saveRes.json();
                alert(`Failed to Save: ${errorData.message}`);
            }

        } catch (error) {
            console.error(error);
            alert(`Upload Failed: ${error.message}`);
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id) {
        if (!confirm('Are you sure?')) return;
        const res = await fetch(`/api/admin/media/${id}`, { method: 'DELETE' });
        if (res.ok) fetchMedia();
    }

    // Filter case-insensitively
    const images = mediaItems.filter(m => m.type && m.type.toLowerCase() === 'image');
    const videos = mediaItems.filter(m => m.type && m.type.toLowerCase() === 'video');

    const [playingVideo, setPlayingVideo] = useState(null);

    return (
        <div>
            <h2>Gallery</h2>

            {/* ... controls ... */}
            <div className={styles.topBar}>
                <select
                    className={styles.select}
                    value={type}
                    onChange={e => {
                        setType(e.target.value);
                        setSelectedIds([]); // Clear selection when switching type
                    }}
                >
                    <option value="IMAGE">Images</option>
                    <option value="VIDEO">Video</option>
                </select>

                <input
                    className={styles.input}
                    placeholder="Image Name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    style={{ flex: 1 }}
                />

                <label className={styles.fileLabel} style={{ flex: 1 }}>
                    {file ? file.name : "Choose file.."}
                    <input
                        id="fileInput"
                        type="file"
                        hidden
                        accept={type === 'IMAGE' ? "image/*" : "video/*"}
                        onChange={e => setFile(e.target.files[0])}
                    />
                </label>

                <input
                    className={styles.input}
                    placeholder="Video Link (Disabled)"
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    disabled={true}
                    style={{ flex: 1, backgroundColor: '#f3f4f6', cursor: 'not-allowed' }}
                />

                <button className={styles.submitBtn} onClick={handleSubmit} disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit'}
                </button>

                <div style={{ minWidth: '100px' }}>
                    {(images.some(i => selectedIds.includes(i.id)) || videos.some(v => selectedIds.includes(v.id))) ? (
                        <button className={styles.deleteBtn} onClick={handleBulkDelete}>
                            Delete ({selectedIds.length})
                        </button>
                    ) : (
                        <button className={styles.deleteBtn}>
                            Delete <span>&#9662;</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Images Grid */}
            {videos.length > 0 && (
                <>
                    <h3 className={styles.sectionTitle}>Video</h3>
                    <div className={styles.grid}>
                        {videos.map(item => (
                            <div key={item.id} className={styles.card}>
                                <div className={styles.cardMediaWrapper}>
                                    <div className={styles.cardMedia} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <span style={{ fontSize: '3rem', color: '#ccc' }}>▶</span>
                                    </div>
                                    <div className={styles.checkboxWrapper}>
                                        <input
                                            type="checkbox"
                                            className={styles.checkbox}
                                            checked={selectedIds.includes(item.id)}
                                            onChange={() => handleSelect(item.id)}
                                        />
                                    </div>
                                </div>
                                <div className={styles.cardBody}>
                                    <div className={styles.row}>
                                        <span className={styles.label}>Name</span>
                                        <span className={styles.val}>{item.name}</span>
                                    </div>
                                    <div className={styles.row}>
                                        <span className={styles.label}>Action</span>
                                        <div className={styles.actions}>
                                            <button className={`${styles.actionBtn} ${styles.replace}`} onClick={() => setPlayingVideo(item)}>View</button>
                                            <span>|</span>
                                            <button className={`${styles.actionBtn} ${styles.delete}`} onClick={() => handleDelete(item.id)}>Delete</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

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

            {/* Video Player Modal */}
            {playingVideo && (
                <div className={styles.modalOverlay} onClick={() => setPlayingVideo(null)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <button className={styles.closeModalBtn} onClick={() => setPlayingVideo(null)}>&times;</button>
                        <video controls autoPlay className={styles.videoPlayer} src={playingVideo.url}>
                            Your browser does not support the video tag.
                        </video>
                        <div style={{ marginTop: '10px', fontWeight: 'bold', textAlign: 'center' }}>{playingVideo.name}</div>
                    </div>
                </div>
            )}

        </div>
    );
}
