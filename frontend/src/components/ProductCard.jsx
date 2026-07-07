function Stars({ rating }) {
  return (
    <div className="stars">
      {'★'.repeat(Math.round(rating))}{'☆'.repeat(5 - Math.round(rating))}
    </div>
  );
}

function fmtPrice(n) {
  return '₱' + Number(n).toLocaleString('en-PH');
}

export default function ProductCard({ product, onClick }) {
  const images = Array.isArray(product.images) ? product.images : JSON.parse(product.images || '[]');
  const cover  = images[0]?.url || product.image_url;
  return (
    <div className="card" onClick={() => onClick(product)}>
      <div className="card-img">
        {cover
          ? <img src={cover} alt={product.name} />
          : <div className="glyph">{product.glyph}</div>
        }
        {product.tag && <div className="tag">{product.tag}</div>}
      </div>
      <div className="card-body">
        <div className="card-cat">{[product.brand, product.category_name].filter(Boolean).join(' · ')}</div>
        <div className="card-name">{product.name}</div>
        <Stars rating={product.rating} />
        <span style={{ color: 'var(--muted)', fontSize: 11, marginLeft: 4 }}>
          ({product.review_count})
        </span>
        <div className="card-foot">
          <div className="price">
            {product.was_price && <s>{fmtPrice(product.was_price)}</s>}
            {fmtPrice(product.price)}
          </div>
          <span className="view-link">View →</span>
        </div>
      </div>
    </div>
  );
}
