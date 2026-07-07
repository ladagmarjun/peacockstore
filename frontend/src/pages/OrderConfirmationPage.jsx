import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { api } from '../services/api';

function fmtPrice(n) { return '₱' + Number(n).toLocaleString('en-PH'); }

export default function OrderConfirmationPage() {
  const { id } = useParams();
  const [order, setOrder]   = useState(null);
  const [error, setError]   = useState('');

  useEffect(() => {
    api.getOrder(id)
      .then(setOrder)
      .catch(err => setError(err.message));
  }, [id]);

  return (
    <>
      <Navbar />
      <div className="wrap" style={{ padding: '80px 28px', textAlign: 'center', maxWidth: 600 }}>
        {error ? (
          <div className="flash flash-error">{error}</div>
        ) : !order ? (
          <div className="loading">Loading…</div>
        ) : (
          <>
            <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 44, color: 'var(--blue)', marginBottom: 8 }}>
              Order Confirmed!
            </h2>
            <p style={{ color: 'var(--muted)', marginBottom: 6 }}>
              Thank you, <strong>{order.customer_name}</strong>.
            </p>
            <p style={{ color: 'var(--muted)', marginBottom: 28 }}>
              Order <strong>#{order.id}</strong> received. We'll contact you at <strong>{order.customer_email}</strong> with shipping details.
            </p>

            <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 16, padding: 24, textAlign: 'left', marginBottom: 28 }}>
              <h4 style={{ color: 'var(--blue)', marginBottom: 12 }}>Order Summary</h4>
              {order.items?.filter(Boolean).map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--line)', fontSize: 14 }}>
                  <span>{item.glyph} {item.product_name} × {item.quantity}</span>
                  <span style={{ fontWeight: 600 }}>{fmtPrice(item.unit_price * item.quantity)}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 12, fontWeight: 700, color: 'var(--blue)', fontSize: 18 }}>
                <span>Total</span>
                <span>{fmtPrice(order.total_amount)}</span>
              </div>
            </div>

            <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 16, padding: 20, textAlign: 'left', marginBottom: 28, fontSize: 14, color: 'var(--muted)' }}>
              <div style={{ marginBottom: 6 }}><strong style={{ color: 'var(--ink)' }}>Ship to:</strong> {order.shipping_address}{order.city ? `, ${order.city}` : ''}</div>
              <div><strong style={{ color: 'var(--ink)' }}>Payment:</strong> {order.payment_method?.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}</div>
            </div>

            <Link to="/" className="btn">Continue Shopping</Link>
          </>
        )}
      </div>
      <Footer />
    </>
  );
}
