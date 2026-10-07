export default function StoreCard({ store: s }) {
  return (
    <article className="store">
      <span className="store-badge">Peacock Branch</span>
      <h3>{s.name}</h3>
      <ul className="store-info">
        <li>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5"/></svg>
          <span>
            {[s.address, [s.barangay, s.city].filter(Boolean).join(', '), s.region].filter(Boolean).map((line, i) => (
              <span key={i} style={{ display: 'block' }}>{line}</span>
            ))}
          </span>
        </li>
        {s.hours && (
          <li>
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
            <span>Open daily · {s.hours}</span>
          </li>
        )}
      </ul>
      {s.map_url && (
        <a href={s.map_url} className="btn store-cta" target="_blank" rel="noreferrer">Get Directions →</a>
      )}
    </article>
  );
}
