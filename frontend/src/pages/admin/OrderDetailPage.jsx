import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { api } from '../../services/api';

function fmtPrice(n) { return '₱' + Number(n).toLocaleString('en-PH'); }
const STATUSES = ['pending','processing','shipped','delivered','cancelled'];

export default function OrderDetailPage() {
  const { id }    = useParams();
  const [order,   setOrder]   = useState(null);
  const [status,  setStatus]  = useState('');
  const [msg,     setMsg]     = useState('');
  const [error,   setError]   = useState('');
  const [saving,  setSaving]  = useState(false);

  useEffect(() => {
    api.adminOrder(id)
      .then(o => { setOrder(o); setStatus(o.status); })
      .catch(err => setError(err.message));
  }, [id]);

  const updateStatus = async () => {
    setSaving(true);
    try {
      const updated = await api.adminUpdateOrderStatus(id, status);
      setOrder(updated);
      setMsg('Status updated.');
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  };

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h1>Order #{id}</h1>
        <Link to="/admin/orders" className="btn-ghost-sm">← Back</Link>
      </div>

      {msg   && <div className="flash flash-success">{msg}</div>}
      {error && <div className="flash flash-error">{error}</div>}

      {order && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
            <div className="admin-card">
              <h3>Customer</h3>
              <p><strong>{order.customer_name}</strong></p>
              <p>{order.customer_email}</p>
              {order.customer_phone && <p>{order.customer_phone}</p>}
            </div>
            <div className="admin-card">
              <h3>Shipping</h3>
              <p>{order.shipping_address}</p>
              {order.city && <p>{order.city}{order.province ? `, ${order.province}` : ''}</p>}
              <p>Payment: <strong>{order.payment_method?.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}</strong></p>
            </div>
          </div>

          <div className="admin-card" style={{ marginBottom: 20 }}>
            <h3>Items</h3>
            <table className="admin-table" style={{ marginTop: 12 }}>
              <thead><tr><th>Product</th><th>Color</th><th>Qty</th><th>Unit Price</th><th>Subtotal</th></tr></thead>
              <tbody>
                {order.items?.filter(Boolean).map((item, i) => (
                  <tr key={i}>
                    <td>{item.glyph} {item.product_name}</td>
                    <td>
                      {item.color
                        ? <span style={{ display: 'inline-block', width: 16, height: 16, borderRadius: '50%', background: item.color, verticalAlign: 'middle' }} />
                        : '—'}
                    </td>
                    <td>{item.quantity}</td>
                    <td>{fmtPrice(item.unit_price)}</td>
                    <td>{fmtPrice(item.unit_price * item.quantity)}</td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={4} style={{ textAlign: 'right', paddingTop: 12, fontWeight: 700 }}>Total</td>
                  <td style={{ paddingTop: 12, fontWeight: 700, fontSize: 18, color: 'var(--blue)' }}>{fmtPrice(order.total_amount)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="admin-card">
            <h3>Update Status</h3>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 12 }}>
              <select value={status} onChange={e => setStatus(e.target.value)} style={{ padding: '10px 14px', border: '1px solid var(--line)', borderRadius: 8, fontSize: 14 }}>
                {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
              <button onClick={updateStatus} className="btn-sm" disabled={saving}>
                {saving ? 'Saving…' : 'Update'}
              </button>
            </div>
            {order.notes && <p style={{ marginTop: 14, color: 'var(--muted)', fontSize: 14 }}><strong>Notes:</strong> {order.notes}</p>}
          </div>
        </>
      )}
    </AdminLayout>
  );
}
