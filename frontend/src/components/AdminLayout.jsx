import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AdminLayout({ children }) {
  const { pathname } = useLocation();
  const { logout }   = useAuth();
  const navigate     = useNavigate();

  const nav = [
    { to: '/admin',          icon: '📊', label: 'Dashboard' },
    { to: '/admin/products', icon: '👜', label: 'Products'  },
    { to: '/admin/banners',  icon: '🖼️', label: 'Slideshow' },
    { to: '/admin/categories', icon: '🏷️', label: 'Categories' },
    { to: '/admin/stores',   icon: '📍', label: 'Stores'    },
    { to: '/admin/orders',   icon: '📦', label: 'Orders'    },
    { to: '/admin/users',    icon: '👤', label: 'Users'     },
  ];

  const handleLogout = async () => { await logout(); navigate('/'); };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          Peacock<br /><small>Admin</small>
        </div>
        <nav className="admin-nav">
          {nav.map(({ to, icon, label }) => (
            <Link key={to} to={to} className={pathname === to ? 'active' : ''}>
              {icon} {label}
            </Link>
          ))}
          <Link to="/" className="back-link">← Store</Link>
          <button
            onClick={handleLogout}
            style={{
              background: 'none', border: 'none', color: 'rgba(255,255,255,.4)',
              padding: '12px 24px', fontSize: 13, fontWeight: 600, cursor: 'pointer', textAlign: 'left',
            }}
          >
            Logout
          </button>
        </nav>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
