import { useState } from 'react';
import { islandOf, regionCode } from './BranchFinder';

export default function StoreCard({ store: s }) {
  const [copied, setCopied] = useState(false);
  const lines = [s.address, [s.barangay, s.city].filter(Boolean).join(', '), s.region].filter(Boolean);
  const island = islandOf(s.region);
  const tag = [island, regionCode(s.region)].filter(Boolean).join(' · ');

  const copy = async () => {
    const text = [s.name, ...lines].join(', ');
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); } catch { /* ignore */ }
      ta.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <article className="store">
      <div className="store-top">
        <span className="store-badge">Peacock Branch</span>
        {tag && <span className="store-tag">{tag}</span>}
      </div>
      <h3>{s.name}</h3>

      <div className="store-addr">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5"/></svg>
        <address>{lines.map((line, i) => <span key={i}>{line}</span>)}</address>
      </div>

      {s.hours && (
        <div className="store-hours">
          <span className="store-time">
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
            {s.hours}
          </span>
          <span className="store-open">Open Daily</span>
        </div>
      )}

      <div className="store-actions">
        {s.map_url && (
          <a href={s.map_url} className="store-dir" target="_blank" rel="noreferrer">Get Directions →</a>
        )}
        <button type="button" className="store-copy" onClick={copy} aria-label={`Copy address of ${s.name}`}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/></svg>
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </article>
  );
}
