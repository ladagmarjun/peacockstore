import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login }  = useAuth();
  const navigate   = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect   = searchParams.get('redirect');
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const change = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await login(form.email, form.password);
      if (redirect) navigate(redirect);
      else navigate(user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="wrap auth-wrap">
        <h2>Welcome back</h2>
        <p className="auth-sub">Sign in to your Peacock account.</p>
        {error && <div className="flash flash-error">{error}</div>}
        <form onSubmit={submit} className="auth-form">
          <div className="form-group">
            <label>Email</label>
            <input name="email" type="email" required autoFocus value={form.email} onChange={change} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input name="password" type="password" required value={form.password} onChange={change} />
          </div>
          <button type="submit" className="btn" disabled={loading} style={{ padding: 14 }}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
        <p style={{ marginTop: 20, fontSize: 14, color: 'var(--muted)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--red)', fontWeight: 700 }}>Register</Link>
        </p>
      </div>
      <Footer />
    </>
  );
}
