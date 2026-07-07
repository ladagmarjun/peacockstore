import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar       from '../components/Navbar';
import Footer       from '../components/Footer';
import ProductCard  from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import HeroSlider   from '../components/HeroSlider';
import { api } from '../services/api';

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

  const activeCat = searchParams.get('cat') || 'all';

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
    if (slug === 'all') searchParams.delete('cat');
    else setSearchParams({ cat: slug });
  };

  return (
    <>
      <Navbar />

      {/* Hero — cover slideshow (falls back to the text hero if no banners) */}
      {banners.length > 0 ? (
        <HeroSlider banners={banners} />
      ) : (
      <section className="banner">
        <div className="wrap banner-inner">
          <div className="banner-text">
            <div className="badge">Handcrafted in the Philippines</div>
            <h1>Genuine Leather,<br /><em>Timeless</em> Craft</h1>
            <p className="banner-sub">
              Bags, backpacks, slings and belts made from full-grain leather —
              built to age beautifully and last decades.
            </p>
            <div className="banner-cta">
              <a href="#shop" className="btn">Shop Collection</a>
              <a href="#stores" className="btn-ghost">Find a Store</a>
            </div>
          </div>
          <div className="banner-art">
            <div className="fan"><div className="glyph">🦚</div></div>
            <div className="banner-meta">
              <span>EST. 2018</span>
              <span>100% GENUINE LEATHER</span>
              <span>PHILIPPINES</span>
            </div>
          </div>
        </div>
      </section>
      )}

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

        {loading ? (
          <div className="loading">Loading products…</div>
        ) : products.length === 0 ? (
          <div className="empty">No products found.</div>
        ) : (
          <div className="grid">
            {products.map(p => (
              <ProductCard key={p.id} product={p} onClick={setSelected} />
            ))}
          </div>
        )}
      </section>

      {/* Stores */}
      {stores.length > 0 && (
        <section className="stores wrap" id="stores">
          <h2>Our Stores</h2>
          <p className="sub">Visit us in person and feel the quality of every stitch.</p>
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
        <div className="wrap market-inner">
          <div>
            <h2>Also Available Online</h2>
            <p>Shop on your favorite marketplace — same prices, same quality guarantee.</p>
          </div>
          <div className="market-links">
            <a href="#" className="mbtn" style={{ background: '#ee4d2d' }}>🛍️ Shopee</a>
            <a href="#" className="mbtn" style={{ background: '#111' }}>📱 TikTok</a>
            <a href="#" className="mbtn" style={{ background: '#0f146d' }}>🛒 Lazada</a>
          </div>
        </div>
      </section>

      <Footer />

      {/* Product Modal */}
      {selected && <ProductModal product={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
