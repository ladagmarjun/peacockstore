import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar       from '../components/Navbar';
import Footer       from '../components/Footer';
import ProductCard  from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import StoreCard    from '../components/StoreCard';
import HeroSlider   from '../components/HeroSlider';
import MarketplaceIcon from '../components/MarketplaceIcon';
import { api, assetUrl } from '../services/api';
import { MARKETPLACES } from '../constants';

const WHY = [
  {
    title: 'Genuine Leather',
    text: 'Every piece is cut from real leather that softens and ages with character.',
    icon: <path d="M12 3l7 4v5c0 4.5-3 8-7 9-4-1-7-4.5-7-9V7l7-4z" />,
  },
  {
    title: 'Made to Last',
    text: 'Clean stitching and solid hardware — built around how you use it every day.',
    icon: <><circle cx="12" cy="12" r="8" /><path d="M12 8v4l3 2" /></>,
  },
  {
    title: 'Shop Your Way',
    text: 'Order here, visit a branch, or find us on Shopee, Lazada and TikTok Shop.',
    icon: <><path d="M5 8h14l-1 13H6L5 8z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></>,
  },
];

// Fallback mid-page promo, shown when no `middle` banner is configured in the admin.
const MID_BANNER = {
  image:    null, // e.g. '/mid-banner.jpg'
  eyebrow:  'Peacock Genuine Leather',
  headline: 'Made to be carried for years',
  text:     'Real leather that softens and ages with character — find the piece that fits your every day.',
  cta:      { label: 'Shop All', href: '#shop' },
};

function coverOf(p) {
  const images = Array.isArray(p.images) ? p.images : JSON.parse(p.images || '[]');
  return images[0]?.url || p.image_url;
}

function SectionHead({ title, sub, children }) {
  return (
    <div className="section-head">
      <div>
        <h2>{title}</h2>
        {sub && <p>{sub}</p>}
      </div>
      {children}
    </div>
  );
}

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products,    setProducts]    = useState([]);
  const [categories,  setCategories]  = useState([]);
  const [stores,      setStores]      = useState([]);
  const [banners,     setBanners]     = useState([]);
  const [midBanner,   setMidBanner]   = useState(null);
  const [selected,    setSelected]    = useState(null);
  const [loading,     setLoading]     = useState(true);
  const shopRef = useRef(null);

  const activeCat   = searchParams.get('cat')   || 'all';
  const activeBrand = searchParams.get('brand') || '';

  useEffect(() => {
    api.getCategories().then(cs => setCategories(cs.filter(c => c.slug !== 'all'))).catch(() => {});
    api.getStores().then(setStores).catch(() => setStores([]));
    api.getBanners('hero').then(setBanners).catch(() => setBanners([]));
    api.getBanners('middle').then(bs => setMidBanner(bs[0] || null)).catch(() => {});
    api.getProducts()
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  // Arriving with a filter (e.g. from the nav dropdowns) jumps to the results.
  useEffect(() => {
    if (activeCat !== 'all' || activeBrand) {
      shopRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeCat, activeBrand]);

  const setCategory = (slug) => {
    const next = {};
    if (slug !== 'all') next.cat = slug;
    if (activeBrand)    next.brand = activeBrand;
    setSearchParams(next);
  };

  const clearBrand = () => {
    const next = {};
    if (activeCat !== 'all') next.cat = activeCat;
    setSearchParams(next);
  };

  // A category's own slug plus every descendant's, so a parent (e.g. Men)
  // also matches products filed under its children (e.g. Wallet).
  const slugsUnder = useCallback((slug) => {
    const out = new Set([slug]);
    for (let grew = true; grew;) {
      grew = false;
      for (const c of categories) {
        const parent = categories.find(p => p.id === c.parent_id);
        if (parent && out.has(parent.slug) && !out.has(c.slug)) { out.add(c.slug); grew = true; }
      }
    }
    return out;
  }, [categories]);

  const activeSlugs = activeCat === 'all' ? null : slugsUnder(activeCat);
  const shown = products.filter(p =>
    (!activeSlugs || activeSlugs.has(p.category?.slug)) &&
    (!activeBrand || (p.brand || '') === activeBrand)
  );

  // "New" tagged pieces first; otherwise the latest few products.
  const newArrivals = useMemo(() => {
    const tagged = products.filter(p => /new/i.test(p.tag || ''));
    return (tagged.length ? tagged : products).slice(0, 4);
  }, [products]);

  // One tile per subcategory (e.g. Wallet, not Men) that has at least one
  // product, using that product's first photo.
  const tiles = useMemo(() => categories
    .filter(c => c.parent_id != null)
    .map(c => {
      const slugs = slugsUnder(c.slug);
      return { ...c, product: products.find(p => slugs.has(p.category?.slug)) };
    })
    .filter(c => c.product), [categories, products, slugsUnder]);

  const mid = midBanner ? {
    image:    assetUrl(midBanner.image_url),
    headline: midBanner.headline,
    text:     midBanner.subtext,
    cta:      midBanner.link_url && { label: 'Shop Now', href: midBanner.link_url },
  } : MID_BANNER;
  const midHasText = mid.eyebrow || mid.headline || mid.text || mid.cta;

  return (
    <>
      <Navbar />

      {/* Hero — admin slideshow if banners exist, otherwise a plain editorial hero */}
      {banners.length > 0 ? (
        <HeroSlider banners={banners} />
      ) : (
        <section className="lhero">
          <div className="lhero-inner">
            <h1>Style, well crafted</h1>
            <p>Genuine leather bags, backpacks, slings and belts — made to be carried for years.</p>
            <div className="lhero-cta">
              <a className="btn-outline-light" href="#shop">Shop All</a>
              <a className="btn-outline-light" href="#branches">Visit Our Branches</a>
            </div>
          </div>
        </section>
      )}

      {/* New arrivals */}
      {newArrivals.length > 0 && (
        <section className="section wrap">
          <SectionHead
            title="New Arrivals"
            sub="The latest genuine leather pieces — designed to elevate your everyday."
          />
          <div className="grid">
            {newArrivals.map(p => <ProductCard key={p.id} product={p} onClick={setSelected} />)}
          </div>
          <div className="section-cta">
            <a href="#shop" className="btn">View all</a>
          </div>
        </section>
      )}

      {/* Mid-page promo banner */}
      <section
        className={`mid-banner${mid.image ? ' has-image' : ''}${midHasText ? ' has-text' : ''}`}
        style={mid.image ? { backgroundImage: `url(${mid.image})` } : undefined}
      >
        <div className="mid-banner-inner">
          {mid.eyebrow && <span className="mid-banner-eyebrow">{mid.eyebrow}</span>}
          {mid.headline && <h2>{mid.headline}</h2>}
          {mid.text && <p>{mid.text}</p>}
          {mid.cta && <a className="btn-outline-light" href={mid.cta.href}>{mid.cta.label}</a>}
        </div>
      </section>

      {/* Shop by category */}
      {tiles.length > 0 && (
        <section className="section wrap">
          <SectionHead title="Shop by Category" />
          <div className="tile-grid">
            {tiles.map(c => {
              const img = coverOf(c.product);
              return (
                <Link key={c.slug} to={`/category/${c.slug}`} className="tile">
                  <div className="tile-img">
                    {img ? <img src={assetUrl(img)} alt="" loading="lazy" /> : <span className="glyph">{c.product.glyph}</span>}
                  </div>
                  <span className="tile-name">{c.name} <span aria-hidden="true">→</span></span>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Shop all */}
      <section className="section wrap" id="shop" ref={shopRef}>
        <SectionHead title="Shop All" sub={`${shown.length} product${shown.length === 1 ? '' : 's'}`}>
          <div className="filters">
            {[{ slug: 'all', name: 'All' }, ...categories].map(c => (
              <button
                key={c.slug}
                className={`chip${activeCat === c.slug ? ' active' : ''}`}
                onClick={() => setCategory(c.slug)}
              >
                {c.name}
              </button>
            ))}
          </div>
        </SectionHead>

        {activeBrand && (
          <div className="brand-filter">
            Brand: <strong>{activeBrand}</strong>
            <button onClick={clearBrand} aria-label="Clear brand filter">✕</button>
          </div>
        )}

        {loading ? (
          <div className="loading">Loading products…</div>
        ) : shown.length === 0 ? (
          <div className="empty">No products found.</div>
        ) : (
          <div className="grid">
            {shown.map(p => <ProductCard key={p.id} product={p} onClick={setSelected} />)}
          </div>
        )}
      </section>

      {/* Why choose us */}
      <section className="why">
        <div className="wrap">
          <h2>Why choose Peacock?</h2>
          <div className="why-grid">
            {WHY.map(w => (
              <div key={w.title} className="why-item">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">{w.icon}</svg>
                <h3>{w.title}</h3>
                <p>{w.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Physical branches */}
      {stores.length > 0 && (
        <section className="section wrap" id="branches">
          <SectionHead title="Visit Our Branches" sub="Come see us in person and feel the quality of every stitch." />
          <div className={`store-grid${stores.length === 1 ? ' single' : ''}`}>
            {stores.map(s => <StoreCard key={s.id} store={s} />)}
          </div>
        </section>
      )}

      {/* Marketplaces */}
      <section className="section wrap market">
        <SectionHead title="Also available on" sub="Same genuine leather goods — shop wherever you like best." />
        <div className="mk-grid">
          {MARKETPLACES.map(m => (
            <a key={m.key} className="mk-card" href={m.url} target="_blank" rel="noreferrer">
              <span className="mk-logo" style={{ background: m.bg }}><MarketplaceIcon brand={m.key} size={22} /></span>
              <span className="mk-meta">
                <small>{m.label}</small>
                <span>{m.handle}</span>
              </span>
            </a>
          ))}
        </div>
      </section>

      <Footer />

      {selected && <ProductModal product={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
