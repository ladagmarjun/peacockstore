import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function fmtPrice(n) {
  return '₱' + Number(n).toLocaleString('en-PH');
}

export default function ProductModal({ product, onClose }) {
  const { addItem } = useCart();
  const navigate    = useNavigate();
  const [activeColor, setActiveColor] = useState(0);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setActiveColor(0);
    setAdded(false);
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [product, onClose]);

  if (!product) return null;

  const colors = Array.isArray(product.colors)
    ? product.colors
    : JSON.parse(product.colors || '[]');

  const images = Array.isArray(product.images)
    ? product.images
    : JSON.parse(product.images || '[]');

  const links = product.links && typeof product.links === 'object'
    ? product.links
    : JSON.parse(product.links || '{}');

  const MARKETPLACES = [
    { key: 'shopee', label: '🛍️ Shopee',      bg: '#ee4d2d' },
    { key: 'tiktok', label: '📱 TikTok Shop',  bg: '#111'    },
    { key: 'lazada', label: '🛒 Lazada',       bg: '#0f146d' },
  ];
  const buyLinks = MARKETPLACES.filter(m => links[m.key]);

  // Swatches come from the tagged photo colors when photos exist,
  // otherwise fall back to the product's plain color list.
  const hasImages = images.length > 0;
  const swatches  = hasImages ? images.map(im => im.color).filter(Boolean) : colors;
  const activeImg = hasImages ? images[activeColor] : null;

  const handleAddToCart = () => {
    addItem(product, swatches[activeColor] || null);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleOrderHere = () => {
    addItem(product, swatches[activeColor] || null);
    onClose();
    navigate('/checkout');
  };

  return (
    <div className="overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="detail">
        <div className="detail-img">
          {activeImg
            ? <img src={activeImg.url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <div className="glyph">{product.glyph}</div>
          }
        </div>

        <div className="detail-info">
          <button className="close-btn" onClick={onClose}>✕</button>
          <div className="card-cat">{[product.brand, product.category_name].filter(Boolean).join(' · ')}</div>
          <h3>{product.name}</h3>

          <div className="rate">
            <span style={{ color: 'var(--red)' }}>
              {'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}
            </span>
            <span>({product.review_count} reviews)</span>
          </div>

          <div className="detail-price">
            {product.was_price && <s>{fmtPrice(product.was_price)}</s>}
            {fmtPrice(product.price)}
          </div>

          <p className="detail-desc">{product.description}</p>

          {product.brand && (
            <div className="spec"><span>Brand</span><span>{product.brand}</span></div>
          )}
          {product.leather_type && (
            <div className="spec"><span>Leather</span><span>{product.leather_type}</span></div>
          )}
          {product.hardware && (
            <div className="spec"><span>Hardware</span><span>{product.hardware}</span></div>
          )}
          {product.dimensions && (
            <div className="spec"><span>Dimensions</span><span>{product.dimensions}</span></div>
          )}

          {swatches.length > 0 && (
            <div className="swatches">
              {swatches.map((c, i) => (
                <div
                  key={i}
                  className={`sw${activeColor === i ? ' active' : ''}`}
                  style={{ background: c }}
                  title={hasImages ? 'View this color' : undefined}
                  onClick={() => setActiveColor(i)}
                />
              ))}
            </div>
          )}

          <div className="buy-label">Buy on</div>
          <div className="buy-links">
            {buyLinks.map(m => (
              <a key={m.key} href={links[m.key]} target="_blank" rel="noreferrer" className="buy" style={{ background: m.bg }}>
                <span>{m.label}</span><span>→</span>
              </a>
            ))}
            <button onClick={handleOrderHere} className="buy" style={{ background: 'var(--blue)', border: 'none' }}>
              <span>✓ Order Here</span><span>→</span>
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            style={{
              marginTop: 10, width: '100%', padding: '12px',
              background: added ? '#166534' : 'transparent',
              color: added ? '#fff' : 'var(--blue)',
              border: '1.5px solid var(--line)', borderRadius: 12,
              fontWeight: 700, fontSize: 14, cursor: 'pointer', transition: 'all .2s',
            }}
          >
            {added ? '✓ Added to Cart' : '+ Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
