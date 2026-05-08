import Image from "next/image";
import styles from "./page.module.css";
import dbConnect from '@/lib/mongodb';
import Slider from '@/models/Slider';
import Media from '@/models/Media';
import JobSection from '@/components/JobSection';
import { getPublicJobs } from '@/app/actions/jobActions';

export const dynamic = 'force-dynamic';

console.log("NextAdmin Version: v2.0 (Fixes Applied)");

async function getSliders() {
  try {
    await dbConnect();
    const sliders = await Slider.find({ status: true }).lean();
    return sliders.map(s => ({ ...s, id: s._id.toString() }));
  } catch (error) {
    console.error("Database Error:", error);
    return [{
      id: 'error-slide',
      name: `DB Error: ${error.message}`,
      imageUrl: 'https://images.unsplash.com/photo-1594322436404-5a0526db4d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
      status: true
    }];
  }
}

async function getFeaturedMedia() {
  try {
    await dbConnect();
    const featured = await Media.find({ isFeatured: true, type: 'image' }).lean();
    return featured.map(m => ({ ...m, id: m._id.toString() }));
  } catch (error) {
    console.error("Featured Media Error:", error);
    return [];
  }
}

export default async function Home() {
  const sliders = await getSliders();
  const featuredMedia = await getFeaturedMedia();
  const initialJobs = await getPublicJobs(0, 10);

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
                  <Image
                    src={slider.imageUrl}
                    alt={slider.name}
                    className={styles.slideImage}
                    fill
                    sizes="100vw"
                    priority={index === 0}
                  />
                </div>
              ))}
              {/* Fallback if only 1 slide or just to ensure coverage */}
              {sliders.length === 1 && (
                <div className={styles.slide}>
                  <Image
                    src={sliders[0].imageUrl}
                    alt={sliders[0].name}
                    className={styles.slideImage}
                    fill
                    sizes="100vw"
                  />
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

        {/* Featured Media Showcase */}
        {featuredMedia.length > 0 && (
          <section className={styles.featuredSection}>
            <div className={styles.featuredGrid}>
              {featuredMedia.map((media) => (
                <div key={media.id} className={styles.featuredCard}>
                  <div className={styles.featuredImageWrapper}>
                    <Image
                      src={media.url}
                      alt={media.name}
                      fill
                      className={styles.featuredImage}
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Job Listings Section */}
        <JobSection initialJobs={initialJobs} />

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
