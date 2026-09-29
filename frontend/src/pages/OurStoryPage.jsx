import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Placeholder copy — replace with Peacock's real story.
const VALUES = [
  { title: 'Genuine leather', text: 'We work only with real leather — it softens, darkens and gains character the more you use it.' },
  { title: 'Honest making', text: 'Clean stitching, solid hardware and simple designs built around how you actually carry things every day.' },
  { title: 'Made for everyday', text: 'Bags, backpacks, slings and belts meant to be used daily, not kept on a shelf.' },
];

export default function OurStoryPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <>
      <Navbar />

      <section className="lhero">
        <div className="lhero-inner story-hero">
          <h1>Our Story</h1>
          <p>Genuine leather goods from the Philippines, made to be carried for years.</p>
        </div>
      </section>

      <section className="section wrap story">
        <div className="story-body">
          <h2>How Peacock began</h2>
          <p>
            Peacock Genuine Leather started with a simple idea: everyday leather goods should be
            made from real leather and built to last. What began as a small collection of bags has
            grown into a range of backpacks, slings and belts — each one chosen for the quality of
            its leather and the care in its making.
          </p>
          <p>
            Today you can find Peacock in our store and on Shopee, Lazada and TikTok Shop. Wherever
            you shop, it's the same genuine leather and the same attention to detail.
          </p>
        </div>
      </section>

      <section className="why">
        <div className="wrap">
          <h2>What we stand for</h2>
          <div className="why-grid">
            {VALUES.map(v => (
              <div key={v.title} className="why-item">
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section wrap story-cta">
        <h2>Find your next everyday piece</h2>
        <div className="lhero-cta">
          <a href="/#shop" className="btn">Shop All</a>
          <a href="/#stores" className="btn-line">Visit Our Store</a>
        </div>
      </section>

      <Footer />
    </>
  );
}
