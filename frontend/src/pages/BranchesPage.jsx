import { useState, useEffect } from 'react';
import Navbar    from '../components/Navbar';
import Footer    from '../components/Footer';
import StoreCard from '../components/StoreCard';
import { api } from '../services/api';

export default function BranchesPage() {
  const [stores, setStores] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    api.getStores().then(setStores).catch(() => setStores([]));
  }, []);

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
          <div className={`store-grid${stores.length === 1 ? ' single' : ''}`}>
            {stores.map(s => <StoreCard key={s.id} store={s} />)}
          </div>
        )}
      </section>

      <Footer />
    </>
  );
}
