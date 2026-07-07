import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar       from '../components/Navbar';
import Footer       from '../components/Footer';
import ProductCard  from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import HeroSlider   from '../components/HeroSlider';
import MarketplaceIcon from '../components/MarketplaceIcon';
import { api } from '../services/api';
import { MARKETPLACES } from '../constants';

const STRIP_ITEMS = [
  'Full-Grain Leather','Solid Brass Hardware','Lifetime Craftsmanship',
  'Ships Nationwide','Shopee & Lazada Verified',
];

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products,    setProducts]    = useState([]);
  const [categories,  setCategories]  = useState([]);
  const [stores,      setStores]      = useState([]);
  const [banners,     setBanners]     = useState([]);
  const [selected,    setSelected]    = useState(null);
  const [loading,     setLoading]     = useState(true);

  const activeCat   = searchParams.get('cat')   || 'all';
  const activeBrand = searchParams.get('brand') || '';

  useEffect(() => {
    api.getCategories().then(setCategories).catch(() => {});
    api.getStores().then(setStores).catch(() => setStores([]));
    api.getBanners().then(setBanners).catch(() => setBanners([]));
  }, []);

  useEffect(() => {
    setLoading(true);
    api.getProducts(activeCat)
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [activeCat]);

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

  // Brand filtering is applied client-side over the current category's products.
  const shown = activeBrand
    ? products.filter(p => (p.brand || '') === activeBrand)
    : products;

  return (
    <>
      <Navbar />

      {/* Hero — admin slideshow if banners exist, otherwise the editorial hero */}
      {banners.length > 0 ? (
        <HeroSlider banners={banners} />
      ) : (
        <section className="lhero">
          <div className="wrap lhero-inner">
            <span className="eyebrow">Handpicked Genuine Leather</span>
            <h1>Everyday leather goods, made to be <em>carried for years</em>.</h1>
            <p>
              Peacock crafts bags, backpacks, slings and belts from genuine leather —
              pieces that age with character and hold up to daily use.
            </p>
            <div className="lhero-cta">
              <a className="btn" href="#shop">Shop Now →</a>
              <a className="btn-line" href="#stores">Visit Our Store</a>
            </div>
          </div>
        </section>
      )}

      {/* Craft intro */}
      <section className="lcraft">
        <div className="wrap">
          <span className="eyebrow center">Our Craft</span>
          <h2>Real leather, honest making</h2>
          <p>
            We keep it simple: genuine leather, clean stitching, and designs built
            around how you actually use them every day.
          </p>
        </div>
      </section>

      {/* Trust Strip */}
      <div className="strip">
        <div className="strip-track">
          {[...STRIP_ITEMS, ...STRIP_ITEMS].map((item, i) => (
            <span key={i}>{item}<span className="dot"> ·</span></span>
          ))}
        </div>
      </div>

      {/* Shop Section */}
      <section className="shop wrap" id="shop">
        <div className="shop-head">
          <h2>
            <small>The Collection</small>
            Shop All Leather Goods
          </h2>
          <div className="filters">
            {categories.map(c => (
              <button
                key={c.slug}
                className={`chip${activeCat === c.slug || (activeCat === 'all' && c.slug === 'all') ? ' active' : ''}`}
                onClick={() => setCategory(c.slug)}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

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
            {shown.map(p => (
              <ProductCard key={p.id} product={p} onClick={setSelected} />
            ))}
          </div>
        )}
      </section>

      {/* Physical Stores */}
      {stores.length > 0 && (
        <section className="stores wrap" id="stores">
          <h2>Visit Our Store</h2>
          <p className="sub">Come see us in person and feel the quality of every stitch.</p>
          <div className="store-grid">
            {stores.map(s => (
              <div key={s.id} className="store">
                <div className="pin">📍</div>
                <h3>{s.name}</h3>
                <p className="addr">{s.address}</p>
                <div className="hours">{s.hours}</div>
                <a href={s.map_url || '#'} className="maplink" target={s.map_url ? '_blank' : undefined} rel="noreferrer">
                  View on Maps →
                </a>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Marketplace Band */}
      <section className="market">
        <div className="wrap">
          <div className="market-head">
            <h2>Find us on your favorite shop</h2>
            <p>Same genuine leather goods — shop wherever you like best.</p>
          </div>
          <div className="mk-grid">
            {MARKETPLACES.map(m => (
              <a key={m.key} className="mk-card" href={m.url} target="_blank" rel="noreferrer">
                <span className="mk-logo" style={{ background: m.bg }}><MarketplaceIcon brand={m.key} size={24} /></span>
                <span className="mk-meta">
                  <small>{m.label}</small>
                  <span>{m.handle}</span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      {/* Product Modal */}
      {selected && <ProductModal product={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
