import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import StoreCard from './StoreCard';

const ISLANDS = ['Luzon', 'Visayas', 'Mindanao'];

// Short region label, e.g. "Metro Manila (NCR)" → "NCR", "Davao Region (Region XI)" → "Region XI"
export function regionCode(region) {
  if (!region) return '';
  const m = region.match(/\(([^)]+)\)/);
  return (m ? m[1] : region).trim();
}

// Philippine island group for a region string
export function islandOf(region) {
  if (!region) return null;
  const r = region.toUpperCase();
  if (/\b(IX|X|XI|XII|XIII)\b|CARAGA|BARMM|ARMM|MINDANAO|ZAMBOANGA|DAVAO|SOCCSKSARGEN|BANGSAMORO/.test(r)) return 'Mindanao';
  if (/\b(VI|VII|VIII)\b|\bNIR\b|VISAYAS|NEGROS/.test(r)) return 'Visayas';
  return 'Luzon';
}

// `limit` caps how many cards show (e.g. on the home page) and adds a "View all" link
export default function BranchFinder({ stores, headingLevel: H = 'h2', limit }) {
  const [query, setQuery]   = useState('');
  const [island, setIsland] = useState('');

  const counts = useMemo(() => {
    const c = { Luzon: 0, Visayas: 0, Mindanao: 0 };
    stores.forEach(s => { const i = islandOf(s.region); if (i) c[i]++; });
    return c;
  }, [stores]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return stores.filter(s =>
      (!island || islandOf(s.region) === island) &&
      (!q || [s.name, s.address, s.barangay, s.city, s.region].some(v => v && v.toLowerCase().includes(q)))
    );
  }, [stores, island, query]);

  const shown = limit ? filtered.slice(0, limit) : filtered;

  const tabs = [{ key: '', label: 'All Branches', count: stores.length },
    ...ISLANDS.filter(i => counts[i] > 0).map(i => ({ key: i, label: i, count: counts[i] }))];

  return (
    <div className="bf">
      <span className="bf-eyebrow">Store Locations</span>
      <H className="bf-title">Visit Our Branches</H>
      <p className="bf-sub">Come see us in person and feel the quality of every stitch.</p>

      <label className="bf-search">
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
        <input
          type="search" value={query} onChange={e => setQuery(e.target.value)}
          placeholder="Search mall, city, or region..." aria-label="Search branches"
        />
      </label>

      <div className="bf-bar">
        <div className="bf-tabs" role="tablist" aria-label="Filter by island group">
          {tabs.map(t => (
            <button
              key={t.key || 'all'} type="button" role="tab" aria-selected={island === t.key}
              className={`bf-tab${island === t.key ? ' active' : ''}`} onClick={() => setIsland(t.key)}
            >
              {t.label} ({t.count})
            </button>
          ))}
        </div>
        <span className="bf-count">Showing {shown.length} of {stores.length} branch{stores.length === 1 ? '' : 'es'}</span>
      </div>

      {filtered.length === 0 ? (
        <div className="empty">
          No branches match your search.{' '}
          <button type="button" className="branch-clear" onClick={() => { setQuery(''); setIsland(''); }}>Clear filters</button>
        </div>
      ) : (
        <div className={`store-grid${shown.length === 1 ? ' single' : ''}`}>
          {shown.map(s => <StoreCard key={s.id} store={s} />)}
        </div>
      )}

      {limit && stores.length > limit && (
        <div className="section-cta">
          <Link to="/branches" className="btn">View All {stores.length} Branches →</Link>
        </div>
      )}
    </div>
  );
}
