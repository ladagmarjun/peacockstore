import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { useSettings } from '../../context/SettingsContext';
import { api } from '../../services/api';

export default function SettingsPage() {
  const { refresh }               = useSettings();
  const [cartEnabled, setCart]    = useState(true);
  const [loaded,  setLoaded]      = useState(false);
  const [saving,  setSaving]      = useState(false);
  const [msg,     setMsg]         = useState('');
  const [error,   setError]       = useState('');

  useEffect(() => {
    api.adminSettings()
      .then(s => setCart(s.cart_enabled !== false))
      .catch(err => setError(err.message))
      .finally(() => setLoaded(true));
  }, []);

  const toggle = async (next) => {
    setCart(next);
    setSaving(true);
    setMsg(''); setError('');
    try {
      await api.adminUpdateSettings({ cart_enabled: next });
      await refresh();
      setMsg('Settings saved.');
    } catch (err) {
      setError(err.message);
      setCart(!next); // roll back on failure
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h1>Settings</h1>
      </div>

      {msg   && <div className="flash flash-success">{msg}</div>}
      {error && <div className="flash flash-error">{error}</div>}

      <div className="admin-section" style={{ maxWidth: 640 }}>
        <h3 style={{ marginTop: 0 }}>Shopping Cart</h3>
        <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 20 }}>
          When enabled, visitors can add items to a cart and check out (they must be
          logged in to place an order). When disabled, the cart and checkout are hidden
          site-wide and customers shop only through your marketplace links and physical stores.
        </p>

        <label className={`switch-row${saving ? ' is-saving' : ''}`}>
          <span className="switch">
            <input
              type="checkbox"
              checked={cartEnabled}
              disabled={!loaded || saving}
              onChange={(e) => toggle(e.target.checked)}
            />
            <span className="switch-slider" />
          </span>
          <span className="switch-label">
            <strong>Enable cart &amp; checkout</strong>
            <em>{cartEnabled ? 'Cart is ON — customers can order online.' : 'Cart is OFF — marketplace / in-store only.'}</em>
          </span>
        </label>
      </div>
    </AdminLayout>
  );
}
