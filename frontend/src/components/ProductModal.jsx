import { useState, useEffect } from 'react';
import MarketplaceIcon from './MarketplaceIcon';
import { assetUrl } from '../services/api';
import { productPhotos } from '../utils/productPhotos';

function fmtPrice(n) {
  return '₱' + Number(n).toLocaleString('en-PH', { minimumFractionDigits: 2 });
}

// Styled with Tailwind. Breakpoints match index.css:
//   max-[991px]: tablets and phones (photo stacks above the details)
//   max-[751px]: phones (modal fills the screen, close button stays pinned)
const arrowCls =
  'absolute top-1/2 -translate-y-1/2 z-2 size-9 rounded-full border-0 cursor-pointer ' +
  'bg-white/85 hover:bg-white text-ink text-[24px] leading-none shadow-[0_1px_4px_rgba(0,0,0,.15)]';

const buyCls =
  'flex items-center justify-between min-h-12 px-[18px] text-white text-[15px] tracking-[.06em] ' +
  'transition-[filter] duration-150 hover:brightness-110';

const labelCls = 'mb-3 text-[12px] tracking-[.14em] uppercase text-muted';

export default function ProductModal({ product, onClose }) {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    setActiveIdx(0);
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [product, onClose]);

  // Freeze the page behind the modal so swipes don't scroll the product grid.
  useEffect(() => {
    if (!product) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [product]);

  if (!product) return null;

  const colors = Array.isArray(product.colors)
    ? product.colors
    : JSON.parse(product.colors || '[]');

  const images = productPhotos(product);

  const links = product.links && typeof product.links === 'object'
    ? product.links
    : JSON.parse(product.links || '{}');

  const MARKETPLACES = [
    { key: 'shopee', label: 'Shopee',      bg: '#ee4d2d' },
    { key: 'tiktok', label: 'TikTok Shop', bg: '#111'    },
    { key: 'lazada', label: 'Lazada',      bg: '#0f146d' },
  ];
  const buyLinks = MARKETPLACES.filter(m => links[m.key]);

  // Swatches come from the tagged photo colors (one per distinct color) when
  // photos exist, otherwise fall back to the product's plain color list.
  const n         = images.length;
  const hasImages = n > 0;
  const activeImg = hasImages ? images[activeIdx] : null;
  const swatches  = hasImages
    ? [...new Set(images.map(im => im.color).filter(Boolean))]
    : colors;
  const go = (idx) => setActiveIdx((idx + n) % n);

  // No marketplace links: send shoppers to the branch list on the home page.
  const visitStore = (e) => {
    const stores = document.getElementById('branches');
    if (!stores) return; // not on the home page — let the link navigate there
    e.preventDefault();
    onClose();
    // Scroll once the modal has unmounted, or the browser cancels it.
    setTimeout(() => stores.scrollIntoView({ behavior: 'smooth' }));
  };

  const specs = [
    ['Brand',      product.brand],
    ['Leather',    product.leather_type],
    ['Hardware',   product.hardware],
    ['Dimensions', product.dimensions],
  ].filter(([, v]) => v);

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center p-6 bg-[rgba(10,42,64,.55)] animate-[fadeIn_.2s_ease] max-[751px]:p-0"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Desktop: fixed-size dialog, so switching between tall and wide photos never resizes it. */}
      <div className="
        grid grid-cols-[1.1fr_1fr] grid-rows-[minmax(0,1fr)] w-full max-w-[1020px] h-[min(680px,90vh)] max-h-[90vh]
        overflow-auto bg-white animate-[slideUp_.25s_ease]
        max-[991px]:grid-cols-1 max-[991px]:grid-rows-none max-[991px]:h-auto
        max-[751px]:max-w-none max-[751px]:h-dvh max-[751px]:max-h-none max-[751px]:overscroll-contain
        max-[751px]:auto-rows-max max-[751px]:content-start
      ">
        <div className="relative flex items-center justify-center min-h-[420px] overflow-hidden bg-white max-[991px]:min-h-0 max-[991px]:aspect-square">
          {activeImg
            ? <>
                {/* Whole photo always visible (contain); a blurred copy fills any leftover space. */}
                <img
                  className="absolute -inset-10 w-[calc(100%+80px)] h-[calc(100%+80px)] object-cover blur-[28px] saturate-[.9] opacity-55 scale-110"
                  src={assetUrl(activeImg.url)} alt="" aria-hidden="true"
                />
                <img className="absolute inset-0 z-1 size-full object-contain" src={assetUrl(activeImg.url)} alt={product.name} />
              </>
            : <div className="text-[150px]">{product.glyph}</div>
          }
          {n > 1 && (
            <>
              <button className={`${arrowCls} left-3`} onClick={() => go(activeIdx - 1)} aria-label="Previous photo">‹</button>
              <button className={`${arrowCls} right-3`} onClick={() => go(activeIdx + 1)} aria-label="Next photo">›</button>
              <div className="absolute inset-x-0 bottom-3.5 z-2 flex justify-center gap-2">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    className={`size-2 p-0 rounded-full border border-ink cursor-pointer ${idx === activeIdx ? 'bg-ink' : 'bg-white/70'}`}
                    onClick={() => setActiveIdx(idx)}
                    aria-label={`Go to photo ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="relative overflow-y-auto px-10 py-11 max-[991px]:overflow-visible max-[751px]:px-5 max-[751px]:py-8">
          {/* Phones: pinned to the screen corner so it stays reachable while the details scroll. */}
          <button
            className="
              absolute top-3.5 right-3.5 size-10 border-0 bg-transparent text-[18px] text-ink
              max-[751px]:fixed max-[751px]:top-3 max-[751px]:right-3 max-[751px]:z-3 max-[751px]:rounded-full
              max-[751px]:bg-white/90 max-[751px]:shadow-[0_1px_4px_rgba(0,0,0,.15)]
            "
            onClick={onClose}
            aria-label="Close"
          >✕</button>
          <div className="card-cat">{[product.brand, product.category?.name].filter(Boolean).join(' · ')}</div>
          <h3 className="mt-1.5 text-[32px] max-[751px]:text-[24px]">{product.name}</h3>

          <div className="flex items-center gap-2 mt-2.5 mb-3.5 text-[13px] text-muted">
            <span className="stars">
              {'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}
            </span>
            <span>({product.review_count} reviews)</span>
          </div>

          {Number(product.price) > 0 && (
            <div className="mb-[18px] text-[20px] tracking-[.06em] text-ink">
              {product.was_price && <s className="mr-2.5 text-[16px] text-muted">{fmtPrice(product.was_price)}</s>}
              {fmtPrice(product.price)}
            </div>
          )}

          <p className="mb-5 text-[15px]">{product.description}</p>

          {specs.map(([label, value]) => (
            <div key={label} className="flex justify-between py-3 border-t border-line text-[14px]">
              <span className="text-muted">{label}</span><span className="text-ink">{value}</span>
            </div>
          ))}

          {swatches.length > 0 && (
            <div className="flex gap-2.5 mt-4 mb-6">
              {swatches.map((c, i) => (
                <div
                  key={i}
                  className={`size-[30px] rounded-full cursor-pointer border-2 border-white ${
                    hasImages && activeImg?.color === c ? 'shadow-[0_0_0_1px_var(--ink)]' : 'shadow-[0_0_0_1px_var(--line)]'
                  }`}
                  style={{ background: c }}
                  title={hasImages ? 'View this color' : undefined}
                  onClick={() => hasImages && setActiveIdx(images.findIndex(im => im.color === c))}
                />
              ))}
            </div>
          )}

          {buyLinks.length > 0 ? (
            <>
              <div className={labelCls}>Buy on</div>
              <div className="flex flex-col gap-2">
                {buyLinks.map(m => (
                  <a key={m.key} href={links[m.key]} target="_blank" rel="noreferrer" className={buyCls} style={{ background: m.bg }}>
                    <span className="inline-flex items-center gap-2">
                      <MarketplaceIcon brand={m.key} size={18} /> {m.label}
                    </span><span>→</span>
                  </a>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className={labelCls}>Available in branch</div>
              <div className="flex flex-col gap-2">
                <a href="/#branches" className={`${buyCls} bg-navy`} onClick={visitStore}>
                  <span>Visit our branch</span><span>→</span>
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
