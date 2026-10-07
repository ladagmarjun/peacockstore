import { useState, useEffect, useMemo } from 'react';
import Navbar    from '../components/Navbar';
import Footer    from '../components/Footer';
import StoreCard from '../components/StoreCard';
import { api } from '../services/api';

export default function BranchesPage() {
  const [stores, setStores] = useState(null);
  const [region, setRegion] = useState('');
  const [city,   setCity]   = useState('');
  const [query,  setQuery]  = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    api.getStores().then(setStores).catch(() => setStores([]));
  }, []);

  const unique = (list) => [...new Set(list.filter(Boolean))].sort();

  const regions = useMemo(() => unique((stores || []).map(s => s.region)), [stores]);
  const cities  = useMemo(
    () => unique((stores || []).filter(s => !region || s.region === region).map(s => s.city)),
    [stores, region]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (stores || []).filter(s =>
      (!region || s.region === region) &&
      (!city   || s.city   === city) &&
      (!q || [s.name, s.address, s.barangay, s.city, s.region].some(v => v && v.toLowerCase().includes(q)))
    );
  }, [stores, region, city, query]);

  const hasFilter = region || city || query;
  const clear = () => { setRegion(''); setCity(''); setQuery(''); };

  return (
    <>
      <Navbar />

      <section className="lhero">
        <div className="lhero-inner story-hero">
          <h1>Our Branches</h1>
          <p>Come see us in person and feel the quality of every stitch.</p>
        </div>
      </section>

      <section className="section wrap">
        {!stores ? (
          <div className="loading">Loading branches…</div>
        ) : stores.length === 0 ? (
          <div className="empty">No branches listed yet.</div>
        ) : (
          <>
            <div className="branch-filters">
              <input
                type="search" value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Find a branch near you" aria-label="Search branches"
              />
              <select value={region} onChange={e => { setRegion(e.target.value); setCity(''); }} aria-label="Region">
                <option value="">All regions</option>
                {regions.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <select value={city} onChange={e => setCity(e.target.value)} aria-label="City">
                <option value="">All cities</option>
                {cities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {hasFilter && <button type="button" className="branch-clear" onClick={clear}>Clear</button>}
            </div>

            {filtered.length === 0 ? (
              <div className="empty">No branches match your search.</div>
            ) : (
              <div className={`store-grid${filtered.length === 1 ? ' single' : ''}`}>
                {filtered.map(s => <StoreCard key={s.id} store={s} />)}
              </div>
            )}
          </>
        )}
      </section>

      <Footer />
    </>
  );
}
