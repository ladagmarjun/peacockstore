import { assetUrl } from '../services/api';
import { coverOf, hoverOf } from '../utils/productPhotos';

function fmtPrice(n) {
  return '₱' + Number(n).toLocaleString('en-PH', { minimumFractionDigits: 2 });
}

export default function ProductCard({ product, onClick }) {
  const cover = coverOf(product);
  // The photo the admin picked for hover (or the second photo) fades in on hover.
  const hover = hoverOf(product);
  return (
    <div className="card" onClick={() => onClick(product)}>
      <div className="card-img">
        {cover
          ? <>
              <img src={assetUrl(cover)} alt={product.name} loading="lazy" />
              {hover && <img className="card-img-alt" src={assetUrl(hover)} alt="" loading="lazy" />}
            </>
          : <div className="glyph">{product.glyph}</div>
        }
        {product.tag && <div className="tag">{product.tag}</div>}
      </div>
      <div className="card-body">
        <div className="card-name">{product.name}</div>
        {Number(product.price) > 0 && (
          <div className="price">
            {product.was_price && <s>{fmtPrice(product.was_price)}</s>}
            {fmtPrice(product.price)}
          </div>
        )}
      </div>
    </div>
  );
}
