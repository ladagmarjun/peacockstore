import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { api } from '../services/api';

export default function Navbar() {
  const { user, logout }   = useAuth();
  const { count }          = useCart();
  const { cartEnabled }    = useSettings();
  const navigate           = useNavigate();
  const [logoOk, setLogoOk]       = useState(true);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands]         = useState([]);
  const [menuOpen, setMenuOpen]     = useState(false);

  useEffect(() => {
    api.getCategories().then(cs => setCategories(cs.filter(c => c.slug !== 'all'))).catch(() => {});
    api.getBrands().then(setBrands).catch(() => {});
  }, []);

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

  return (
    <header className="site-header">
      <div className="wrap nav">
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

        <nav className="menu">
          <a href="/#shop" onClick={goToShop}>Shop</a>

          <div className="menu-item has-dropdown">
            <button type="button" className="menu-trigger">Categories <span className="caret">▾</span></button>
            <div className="dropdown-panel">
              {categories.length === 0
                ? <span className="dropdown-empty">No categories</span>
                : categories.map(c => (
                    <Link key={c.slug} to={`/?cat=${c.slug}`}>{c.name}</Link>
                  ))}
            </div>
          </div>

          <div className="menu-item has-dropdown">
            <button type="button" className="menu-trigger">Brands <span className="caret">▾</span></button>
            <div className="dropdown-panel">
              {brands.length === 0
                ? <span className="dropdown-empty">No brands yet</span>
                : brands.map(b => (
                    <Link key={b.id} to={`/?brand=${encodeURIComponent(b.name)}`}>{b.name}</Link>
                  ))}
            </div>
          </div>

          <a href="/#stores">Stores</a>
          <a href="/#contact">Contact</a>
        </nav>

        <div className="nav-right">
          {cartEnabled && (
            <Link to="/checkout" className="nav-link" style={{ position: 'relative' }}>
              🛒 Cart{count > 0 && (
                <span style={{
                  background: 'var(--red)', color: '#fff', borderRadius: '50%',
                  width: 18, height: 18, fontSize: 11, fontWeight: 700,
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  position: 'absolute', top: -6, right: -10,
                }}>{count}</span>
              )}
            </Link>
          )}

          {user ? (
            <>
              {user.role === 'admin' && (
                <Link to="/admin" className="nav-link-red">Admin</Link>
              )}
              <button onClick={handleLogout} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                Logout
              </button>
            </>
          ) : (
            cartEnabled && <Link to="/login" className="nav-link">Login</Link>
          )}

          <button
            className="hamburger"
            aria-label="Menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(o => !o)}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="mobile-menu">
          <a href="/#shop" onClick={(e) => { goToShop(e); closeMenu(); }}>Shop</a>

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

          <a href="/#stores" onClick={closeMenu}>Stores</a>
          <a href="/#contact" onClick={closeMenu}>Contact</a>
        </div>
      )}
    </header>
  );
}
