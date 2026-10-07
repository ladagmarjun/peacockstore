import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { MARKETPLACES, CONTACT } from '../constants';
import MarketplaceIcon from './MarketplaceIcon';

export default function Footer() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.getCategories().then(cs => setCategories(cs.filter(c => c.slug !== 'all' && c.parent_id == null))).catch(() => {});
  }, []);

  return (
    <footer className="site-footer" id="contact">
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <h4>Peacock Genuine Leather</h4>
            <p className="foot-about">
              Handcrafted genuine leather goods made to last a lifetime.
              Every bag, belt and backpack tells a story.
            </p>
          </div>
          <div>
            <h4>Shop</h4>
            <ul>
              {categories.map(c => (
                <li key={c.slug}><Link to={`/?cat=${c.slug}`}>{c.name}</Link></li>
              ))}
              <li><a href="/#shop">Shop All</a></li>
            </ul>
          </div>
          <div>
            <h4>Get in touch</h4>
            <ul>
              <li><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></li>
              <li><a href={CONTACT.facebook} target="_blank" rel="noreferrer">Facebook</a></li>
              <li><Link to="/our-story">Our Story</Link></li>
              <li><a href="/#stores">Visit our store</a></li>
            </ul>
          </div>
        </div>
        <div className="copyright">
          <div className="foot-socials">
            {MARKETPLACES.map(m => (
              <a key={m.key} href={m.url} target="_blank" rel="noreferrer" aria-label={m.label} title={m.label}>
                <MarketplaceIcon brand={m.key} size={18} />
              </a>
            ))}
          </div>
          <span>© {new Date().getFullYear()} Peacock Genuine Leather · Philippines</span>
        </div>
      </div>
    </footer>
  );
}
