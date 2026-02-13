import Image from "next/image";
import styles from "./page.module.css";
import dbConnect from '@/lib/mongodb';
import Slider from '@/models/Slider';

async function getSliders() {
  // Direct DB access since this is a Server Component
  await dbConnect();
  // Pure JSON needed for client components if passed, but here directly rendering
  const sliders = await Slider.find({ status: true }).lean();
  // Convert _id to string if needed
  return sliders.map(s => ({ ...s, id: s._id.toString() }));
}

export default async function Home() {
  const sliders = await getSliders();

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {/* Navigation / Header Placeholder */}
        <header className={styles.header}>
          <div className={styles.logo}>NextAdmin</div>
          <nav className={styles.nav}>
            <a href="#">Home</a>
            <a href="#">About</a>
            <a href="#">Contact</a>
            <a href="/admin" className={styles.adminLink}>Admin Login</a>
          </nav>
        </header>

        {/* Hero Section with Slider */}
        <section className={styles.heroSection}>
          {sliders.length > 0 ? (
            <div className={styles.sliderContainer}>
              {sliders.map((slider, index) => (
                <div key={slider.id} className={styles.slide}>
                  <img src={slider.imageUrl} alt={slider.name} className={styles.slideImage} />
                </div>
              ))}
              {/* Fallback if only 1 slide or just to ensure coverage */}
              {sliders.length === 1 && (
                <div className={styles.slide}>
                  <img src={sliders[0].imageUrl} alt={sliders[0].name} className={styles.slideImage} />
                </div>
              )}
            </div>
          ) : (
            <div className={styles.noSlides}>
              <h2>Welcome to NextAdmin</h2>
              <p>No active sliders available. Please configure in Admin Panel.</p>
            </div>
          )}
        </section>

        {/* Content Placeholder */}
        <section className={styles.contentSection}>
          <h2>Latest Updates</h2>
          <p>Welcome to our platform. We provide excellent services for tailored solutions.</p>
          <div className={styles.grid}>
            <div className={styles.card}>
              <h3>Service 1</h3>
              <p>Description of service 1.</p>
            </div>
            <div className={styles.card}>
              <h3>Service 2</h3>
              <p>Description of service 2.</p>
            </div>
            <div className={styles.card}>
              <h3>Service 3</h3>
              <p>Description of service 3.</p>
            </div>
          </div>
        </section>

        <footer className={styles.footer}>
          <p>&copy; 2026 NextAdmin. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
}
