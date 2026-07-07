import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar  from '../components/Navbar';
import Footer  from '../components/Footer';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

function fmtPrice(n) { return '₱' + Number(n).toLocaleString('en-PH'); }

export default function CheckoutPage() {
  const { cart, total, clearCart, removeItem, updateQty } = useCart();
  const { user }    = useAuth();
  const navigate    = useNavigate();
  const [form, setForm] = useState({
    customer_name:    user?.full_name || '',
    customer_email:   user?.email    || '',
    customer_phone:   '',
    shipping_address: '',
    city:             '',
    province:         '',
    postal_code:      '',
    payment_method:   'cod',
    notes:            '',
  });
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const change = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!cart.length) { setError('Your cart is empty.'); return; }
    setLoading(true);
    setError('');
    try {
      const items = cart.map(i => ({ product_id: i.product_id, quantity: i.quantity, color: i.color }));
      const { order_id } = await api.placeOrder({ ...form, items });
      clearCart();
      navigate(`/orders/${order_id}/confirmation`);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="wrap" style={{ padding: '60px 28px', display: 'grid', gridTemplateColumns: '1fr 380px', gap: 40, alignItems: 'start' }}>
        {/* Form */}
        <div>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 42, color: 'var(--blue)', marginBottom: 8 }}>Checkout</h2>
          <p style={{ color: 'var(--muted)', marginBottom: 32 }}>Fill in your details and we'll get your order to you.</p>

          {error && <div className="flash flash-error">{error}</div>}

          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="form-row">
              <div className="form-group">
                <label>Full Name *</label>
                <input name="customer_name" required value={form.customer_name} onChange={change} />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input name="customer_email" type="email" required value={form.customer_email} onChange={change} />
              </div>
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input name="customer_phone" placeholder="+63 9XX XXX XXXX" value={form.customer_phone} onChange={change} />
            </div>
            <div className="form-group">
              <label>Shipping Address *</label>
              <textarea name="shipping_address" rows={3} required placeholder="House/Unit No., Street, Barangay" value={form.shipping_address} onChange={change} />
            </div>
            <div className="form-row">
              <div className="form-group"><label>City</label><input name="city" value={form.city} onChange={change} /></div>
              <div className="form-group"><label>Province</label><input name="province" value={form.province} onChange={change} /></div>
              <div className="form-group"><label>Postal Code</label><input name="postal_code" value={form.postal_code} onChange={change} /></div>
            </div>
            <div className="form-group">
              <label>Payment Method</label>
              <select name="payment_method" value={form.payment_method} onChange={change}>
                <option value="cod">Cash on Delivery</option>
                <option value="gcash">GCash</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="credit_card">Credit / Debit Card</option>
              </select>
            </div>
            <div className="form-group">
              <label>Notes (optional)</label>
              <textarea name="notes" rows={2} placeholder="Color preference, special instructions…" value={form.notes} onChange={change} />
            </div>
            <button type="submit" className="btn" disabled={loading} style={{ padding: '16px', fontSize: 16 }}>
              {loading ? 'Placing order…' : 'Place Order'}
            </button>
          </form>
        </div>

        {/* Cart Summary */}
        <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 18, padding: 28, position: 'sticky', top: 100 }}>
          <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, color: 'var(--blue)', marginBottom: 16 }}>Your Cart</h3>
          {cart.length === 0 ? (
            <p style={{ color: 'var(--muted)', fontSize: 14 }}>No items yet.</p>
          ) : (
            <>
              {cart.map(item => (
                <div key={`${item.product_id}-${item.color}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--line)', gap: 8 }}>
                  <div style={{ fontSize: 14 }}>
                    <span style={{ fontSize: 20 }}>{item.glyph} </span>
                    {item.name}
                    {item.color && <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: '50%', background: item.color, marginLeft: 6, verticalAlign: 'middle' }} />}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                    <button onClick={() => updateQty(item.product_id, item.color, item.quantity - 1)} style={{ background: 'none', border: '1px solid var(--line)', borderRadius: 4, width: 24, height: 24, cursor: 'pointer' }}>−</button>
                    <span style={{ fontWeight: 700, minWidth: 20, textAlign: 'center' }}>{item.quantity}</span>
                    <button onClick={() => updateQty(item.product_id, item.color, item.quantity + 1)} style={{ background: 'none', border: '1px solid var(--line)', borderRadius: 4, width: 24, height: 24, cursor: 'pointer' }}>+</button>
                    <span style={{ fontWeight: 700, fontSize: 14, minWidth: 80, textAlign: 'right' }}>{fmtPrice(item.price * item.quantity)}</span>
                    <button onClick={() => removeItem(item.product_id, item.color)} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: 16 }}>×</button>
                  </div>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 16, fontWeight: 700, fontSize: 20, color: 'var(--blue)' }}>
                <span>Total</span>
                <span>{fmtPrice(total)}</span>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
