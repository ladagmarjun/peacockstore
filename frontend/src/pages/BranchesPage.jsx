import { useState, useEffect } from 'react';
import Navbar       from '../components/Navbar';
import Footer       from '../components/Footer';
import BranchFinder from '../components/BranchFinder';
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

      <section className="section wrap bf-page">
        {!stores ? (
          <div className="loading">Loading branches…</div>
        ) : stores.length === 0 ? (
          <div className="empty">No branches listed yet.</div>
        ) : (
          <BranchFinder stores={stores} headingLevel="h1" />
        )}
      </section>

      <Footer />
    </>
  );
}
