import Link from 'next/link';
import styles from './admin.module.css';

export default function AdminLayout({ children }) {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.logo}>JobHunt</div>
                <nav className={styles.nav}>
                    <Link href="/admin/slider">Slider</Link>
                    <Link href="/admin/jobs">Job Management</Link>
                    <Link href="/admin/media">Media</Link>
                </nav>
                <div className="user-actions">
                    <span>Admin</span>
                </div>
            </header>
            <main className={styles.content}>
                {children}
            </main>
        </div>
    );
}
