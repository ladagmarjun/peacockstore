import { useEffect, useState } from 'react';

export default function HeroSlider({ banners }) {
  const [i, setI] = useState(0);
  const n = banners.length;

  useEffect(() => {
    if (n <= 1) return;
    const t = setInterval(() => setI(p => (p + 1) % n), 5000);
    return () => clearInterval(t);
  }, [n]);

  if (!n) return null;
  const go = (idx) => setI((idx + n) % n);

  return (
    <section className="hero-slider">
      <div className="hero-track" style={{ transform: `translateX(-${i * 100}%)` }}>
        {banners.map((b) => {
          const Tag = b.link_url ? 'a' : 'div';
          const tagProps = b.link_url ? { href: b.link_url } : {};
          return (
            <Tag className="hero-slide" key={b.id} {...tagProps}>
              <img src={b.image_url} alt={b.headline || 'Peacock Leather'} />
              {(b.headline || b.subtext) && (
                <div className="hero-overlay">
                  {b.headline && <h2>{b.headline}</h2>}
                  {b.subtext && <p>{b.subtext}</p>}
                  {b.link_url && <span className="btn hero-cta">Shop Now →</span>}
                </div>
              )}
            </Tag>
          );
        })}
      </div>

      {n > 1 && (
        <>
          <button className="hero-arrow prev" onClick={() => go(i - 1)} aria-label="Previous slide">‹</button>
          <button className="hero-arrow next" onClick={() => go(i + 1)} aria-label="Next slide">›</button>
          <div className="hero-dots">
            {banners.map((_, idx) => (
              <button
                key={idx}
                className={idx === i ? 'active' : ''}
                onClick={() => go(idx)}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
