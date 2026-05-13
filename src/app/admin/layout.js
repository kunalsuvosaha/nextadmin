'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import styles from './admin.module.css';

export default function AdminLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const [admin, setAdmin] = useState(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const navItems = [
        { href: '/admin/slider', label: 'Slider' },
        { href: '/admin/jobs', label: 'Job Management' },
        { href: '/admin/media', label: 'Media' },
    ];

    useEffect(() => {
        if (pathname === '/admin/login' || pathname === '/admin/register') {
            return;
        }

        let ignore = false;

        async function loadAdminProfile() {
            try {
                const res = await fetch('/api/auth/me', { cache: 'no-store' });

                if (!res.ok) {
                    return;
                }

                const data = await res.json();

                if (!ignore) {
                    setAdmin(data.admin);
                }
            } catch {
                if (!ignore) {
                    setAdmin(null);
                }
            }
        }

        loadAdminProfile();

        return () => {
            ignore = true;
        };
    }, [pathname]);

    // Do not show the navigation header on auth pages
    if (pathname === '/admin/login' || pathname === '/admin/register') {
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
                    <div className={styles.profileMenu}>
                        <button
                            type="button"
                            className={styles.profileButton}
                            onClick={() => setIsProfileOpen((current) => !current)}
                            aria-expanded={isProfileOpen}
                            aria-haspopup="true"
                            aria-label="Open admin profile"
                        >
                            <span className={styles.profileIcon} aria-hidden="true" />
                        </button>
                        {isProfileOpen && (
                            <div className={styles.profileDropdown}>
                                <div className={styles.profileHeader}>
                                    <p className={styles.profileWelcome}>Welcome {admin?.name || 'Admin'}</p>
                                    <button
                                        type="button"
                                        className={styles.profileClose}
                                        onClick={() => setIsProfileOpen(false)}
                                        aria-label="Close admin profile"
                                    >
                                        x
                                    </button>
                                </div>
                                <div className={styles.profileDetails}>
                                    <span>Name</span>
                                    <strong>{admin?.name || 'Admin'}</strong>
                                </div>
                                <div className={styles.profileDetails}>
                                    <span>Email</span>
                                    <strong>{admin?.email || 'Not available'}</strong>
                                </div>
                                <div className={styles.profileDetails}>
                                    <span>Role</span>
                                    <strong>{admin?.role || 'admin'}</strong>
                                </div>
                            </div>
                        )}
                    </div>
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
