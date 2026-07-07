import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate     = useNavigate();
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', password: '', confirm_password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const change = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register(form);
      navigate('/');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="wrap auth-wrap">
        <h2>Create Account</h2>
        <p className="auth-sub">Join Peacock Leather and track your orders.</p>
        {error && <div className="flash flash-error">{error}</div>}
        <form onSubmit={submit} className="auth-form">
          <div className="form-group">
            <label>Full Name *</label>
            <input name="full_name" required autoFocus value={form.full_name} onChange={change} />
          </div>
          <div className="form-group">
            <label>Email *</label>
            <input name="email" type="email" required value={form.email} onChange={change} />
          </div>
          <div className="form-group">
            <label>Phone (optional)</label>
            <input name="phone" placeholder="+63 9XX XXX XXXX" value={form.phone} onChange={change} />
          </div>
          <div className="form-group">
            <label>Password *</label>
            <input name="password" type="password" required minLength={8} value={form.password} onChange={change} />
          </div>
          <div className="form-group">
            <label>Confirm Password *</label>
            <input name="confirm_password" type="password" required minLength={8} value={form.confirm_password} onChange={change} />
          </div>
          <button type="submit" className="btn" disabled={loading} style={{ padding: 14 }}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>
        <p style={{ marginTop: 20, fontSize: 14, color: 'var(--muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--red)', fontWeight: 700 }}>Sign In</Link>
        </p>
      </div>
      <Footer />
    </>
  );
}
