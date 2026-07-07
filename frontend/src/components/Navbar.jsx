import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const [logoOk, setLogoOk] = useState(true);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <>
      <div className="ticker">
        <b>Free shipping</b> on orders over ₱3,000 · Genuine leather, guaranteed · Ships within 2–3 days
      </div>
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
            <Link to="/">Shop</Link>
            <Link to="/?cat=bags">Bags</Link>
            <Link to="/?cat=backpacks">Backpacks</Link>
            <Link to="/?cat=sling">Sling</Link>
            <Link to="/?cat=belts">Belts</Link>
          </nav>

          <div className="nav-right">
            <div className="socials">
              <button className="sbtn s-shopee">🛍️ Shopee</button>
              <button className="sbtn s-tiktok">📱 TikTok</button>
              <button className="sbtn s-lazada">🛒 Lazada</button>
            </div>

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
              <Link to="/login" className="nav-link">Login</Link>
            )}

            <button className="hamburger">☰</button>
          </div>
        </div>
      </header>
    </>
  );
}
