import styles from './admin.module.css';

export default function AdminLoading() {
    return (
        <div className={styles.loadingInline} role="status" aria-live="polite" aria-label="Loading page">
            <div className={styles.spinner}></div>
        </div>
    );
}
