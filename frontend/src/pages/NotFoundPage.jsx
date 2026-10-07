import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function NotFoundPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <>
      <Navbar />

      <section className="lhero">
        <div className="lhero-inner story-hero">
          <h1>Page not found</h1>
          <p>Sorry, the page you're looking for doesn't exist or has moved.</p>
        </div>
      </section>

      <section className="section wrap" style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" className="btn">Back to Home</Link>
          <Link to="/branches" className="btn">Find a Branch</Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
