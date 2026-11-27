import { useEffect, useState } from 'react';
import { assetUrl } from '../services/api';

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
          const { label, headline } = b;
          return (
            <div className="hero-slide" key={b.id}>
              <img src={assetUrl(b.image_url)} alt={headline || label || 'Peacock Leather'} />
              {/* Phones only: the title sits in the blue middle third of the image */}
              {(headline || label) && <div className="hero-center" aria-hidden="true">{headline || label}</div>}
              {(label || headline || b.subtext || b.link_url) && (
                <div className={`hero-overlay align-${b.align || 'center'}`}>
                  {label && <span className="hero-eyebrow">{label}</span>}
                  {headline && <h2>{headline}</h2>}
                  {b.subtext && <p>{b.subtext}</p>}
                  {b.link_url && <a className="btn-outline-light hero-cta" href={b.link_url}>Shop Now</a>}
                </div>
              )}
            </div>
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
