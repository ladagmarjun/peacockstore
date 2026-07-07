import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { MARKETPLACES, CONTACT } from '../constants';

export default function Footer() {
  const { user, logout }  = useAuth();
  const { cartEnabled }   = useSettings();

  return (
    <footer className="site-footer" id="contact">
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <div className="foot-logo">Peacock <b>Leather</b></div>
            <p className="foot-about">
              Handcrafted genuine leather goods made to last a lifetime.
              Every bag, belt and backpack tells a story.
            </p>
            <div className="foot-socials">
              {MARKETPLACES.map(m => (
                <a key={m.key} href={m.url} target="_blank" rel="noreferrer" className={`sbtn s-${m.key}`} style={{ fontSize: 11 }}>
                  {m.label}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4>Shop</h4>
            <ul>
              <li><Link to="/?cat=bags">Bags</Link></li>
              <li><Link to="/?cat=backpacks">Backpacks</Link></li>
              <li><Link to="/?cat=sling">Sling</Link></li>
              <li><Link to="/?cat=belts">Belts</Link></li>
            </ul>
          </div>
          <div>
            <h4>Get in touch</h4>
            <ul>
              <li><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></li>
              <li><a href={CONTACT.facebook} target="_blank" rel="noreferrer">Facebook</a></li>
              <li><a href="/#stores">Visit our store</a></li>
            </ul>
          </div>
          {(user || cartEnabled) && (
            <div>
              <h4>Account</h4>
              <ul>
                {user ? (
                  <>
                    {user.role === 'admin' && <li><Link to="/admin">Admin Panel</Link></li>}
                    <li><button onClick={logout} style={{ background: 'none', border: 'none', color: '#9fb4c4', fontSize: 14, cursor: 'pointer', padding: 0 }}>Logout</button></li>
                  </>
                ) : (
                  <>
                    <li><Link to="/login">Login</Link></li>
                    <li><Link to="/register">Register</Link></li>
                  </>
                )}
              </ul>
            </div>
          )}
        </div>
        <div className="copyright">
          <span>© {new Date().getFullYear()} Peacock Genuine Leather. All rights reserved.</span>
          <span>Philippines 🇵🇭</span>
        </div>
      </div>
    </footer>
  );
}
