import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const ANNOUNCEMENTS = [
  'Genuine leather goods, handcrafted to last',
  'Ships nationwide — also on Shopee, Lazada & TikTok Shop',
  'Visit our store and feel the quality of every stitch',
];

const Caret = () => (
  <svg className="caret" width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
    <path d="M1 1l4 4 4-4" />
  </svg>
);

function AnnouncementBar() {
  const [i, setI] = useState(0);
  const n = ANNOUNCEMENTS.length;
  useEffect(() => {
    const t = setInterval(() => setI(p => (p + 1) % n), 5000);
    return () => clearInterval(t);
  }, [n]);
  return (
    <div className="announce">
      <button aria-label="Previous announcement" onClick={() => setI((i - 1 + n) % n)}>‹</button>
      <p key={i}>{ANNOUNCEMENTS[i]}</p>
      <button aria-label="Next announcement" onClick={() => setI((i + 1) % n)}>›</button>
    </div>
  );
}

export default function Navbar() {
  const { user, logout }   = useAuth();
  const navigate           = useNavigate();
  const [logoOk, setLogoOk]       = useState(true);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands]         = useState([]);
  const [menuOpen, setMenuOpen]     = useState(false);
  // Which desktop dropdown is open ('cat' | 'brand' | null). Opening on click
  // (not only CSS :hover) keeps the menu usable on touch devices, where a
  // hover-only dropdown opens on the first tap but gets stuck afterwards.
  const [openDrop, setOpenDrop]     = useState(null);
  const menuRef                     = useRef(null);

  useEffect(() => {
    api.getCategories().then(cs => setCategories(cs.filter(c => c.slug !== 'all'))).catch(() => {});
    api.getBrands().then(setBrands).catch(() => {});
  }, []);

  // Close the open dropdown when clicking anywhere outside the desktop menu.
  useEffect(() => {
    if (!openDrop) return;
    const onDocClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpenDrop(null);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [openDrop]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // On the home page, smooth-scroll to the shop section; elsewhere let the
  // link navigate to /#shop as normal.
  const goToShop = (e) => {
    const el = document.getElementById('shop');
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth' });
      window.history.replaceState(null, '', '/#shop');
    }
  };

  const closeMenu = () => setMenuOpen(false);

  const dropdown = (key, label, items, empty, toHref, keyOf, nameOf) => (
    <div
      className={`menu-item has-dropdown${openDrop === key ? ' open' : ''}`}
      onMouseEnter={() => setOpenDrop(key)}
      onMouseLeave={() => setOpenDrop(null)}
    >
      <button
        type="button"
        className="menu-trigger"
        aria-expanded={openDrop === key}
        onClick={() => setOpenDrop(key)}
      >
        {label} <Caret />
      </button>
      <div className="dropdown-panel">
        {items.length === 0
          ? <span className="dropdown-empty">{empty}</span>
          : items.map(it => (
              <Link key={keyOf(it)} to={toHref(it)} onClick={() => setOpenDrop(null)}>{nameOf(it)}</Link>
            ))}
      </div>
    </div>
  );

  return (
    <>
      <AnnouncementBar />
      <header className="site-header">
        <div className="wrap nav">
          <button
            className="hamburger"
            aria-label="Menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(o => !o)}
          >
            {menuOpen ? '✕' : '☰'}
          </button>

          <Link to="/" className="logo-text">
            {logoOk ? (
              <img
                src="/peacock logo.jpg"
                alt="Peacock Genuine Leather"
                className="logo-img"
                onError={() => setLogoOk(false)}
              />
            ) : (
              <>Peacock <span>Genuine Leather</span></>
            )}
          </Link>

          <nav className="menu" ref={menuRef}>
            <a href="/#shop" onClick={goToShop}>Shop All</a>
            {dropdown('cat', 'Categories', categories, 'No categories',
              c => `/?cat=${c.slug}`, c => c.slug, c => c.name)}
            {dropdown('brand', 'Brands', brands, 'No brands yet',
              b => `/?brand=${encodeURIComponent(b.name)}`, b => b.id, b => b.name)}
            <Link to="/our-story">Our Story</Link>
            <a href="/#stores">Stores</a>
            <a href="/#contact">Contact</a>
          </nav>

          <div className="nav-right">
            {user?.role === 'admin' && <Link to="/admin" className="nav-link">Admin</Link>}
            {user && <button onClick={handleLogout} className="nav-link">Logout</button>}
          </div>
        </div>

        {menuOpen && (
          <div className="mobile-menu">
            <a href="/#shop" onClick={(e) => { goToShop(e); closeMenu(); }}>Shop All</a>

            <div className="mobile-group">
              <span className="mobile-group-title">Categories</span>
              {categories.length === 0
                ? <span className="dropdown-empty">No categories</span>
                : categories.map(c => (
                    <Link key={c.slug} to={`/?cat=${c.slug}`} onClick={closeMenu}>{c.name}</Link>
                  ))}
            </div>

            <div className="mobile-group">
              <span className="mobile-group-title">Brands</span>
              {brands.length === 0
                ? <span className="dropdown-empty">No brands yet</span>
                : brands.map(b => (
                    <Link key={b.id} to={`/?brand=${encodeURIComponent(b.name)}`} onClick={closeMenu}>{b.name}</Link>
                  ))}
            </div>

            <Link to="/our-story" onClick={closeMenu}>Our Story</Link>
            <a href="/#stores" onClick={closeMenu}>Stores</a>
            <a href="/#contact" onClick={closeMenu}>Contact</a>
          </div>
        )}
      </header>
    </>
  );
}
