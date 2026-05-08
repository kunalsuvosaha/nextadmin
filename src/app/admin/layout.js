'use client';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import styles from './admin.module.css';

export default function AdminLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const navItems = [
        { href: '/admin/slider', label: 'Slider' },
        { href: '/admin/jobs', label: 'Job Management' },
        { href: '/admin/media', label: 'Media' },
    ];

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
                <nav className={styles.nav}>
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={isActive ? styles.activeNavLink : undefined}
                                aria-current={isActive ? 'page' : undefined}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
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
