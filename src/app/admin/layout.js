'use client';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import styles from './admin.module.css';

export default function AdminLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();

    // Do not show the navigation header if we are on the login page
    if (pathname === '/admin/login') {
        return (
            <div className={styles.container}>
                <main className={styles.content}>
                    {children}
                </main>
            </div>
        );
    }

    const handleLogout = async () => {
        await fetch('/api/admin/logout', { method: 'POST' });
        router.push('/admin/login');
        router.refresh();
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.logo}>JobHunt</div>
                <nav className={styles.nav}>
                    <Link href="/admin/slider">Slider</Link>
                    <Link href="/admin/jobs">Job Management</Link>
                    <Link href="/admin/media">Media</Link>
                </nav>
                <div className={styles.userActions}>
                    <Link href="/" className={styles.btnWebsite}>Go to Website</Link>
                    <button onClick={handleLogout} className={styles.btnLogout}>Logout</button>
                </div>
            </header>
            <main className={styles.content}>
                {children}
            </main>
        </div>
    );
}
