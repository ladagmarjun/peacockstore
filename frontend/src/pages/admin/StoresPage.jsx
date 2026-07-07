import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { api } from '../../services/api';

const EMPTY = {
  id: null, name: '', address: '', hours: '', map_url: '', sort_order: 0, is_active: true,
};

export default function StoresPage() {
  const [stores,  setStores]  = useState([]);
  const [form,    setForm]    = useState(EMPTY);
  const [msg,     setMsg]     = useState('');
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const isEdit = Boolean(form.id);

  const load = () => api.adminStores().then(setStores).catch(err => setError(err.message));

  useEffect(() => { load(); }, []);

  const change = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const reset = () => { setForm(EMPTY); setError(''); };

  const edit = (s) => {
    setMsg(''); setError('');
    setForm({
      id: s.id, name: s.name, address: s.address,
      hours: s.hours || '', map_url: s.map_url || '',
      sort_order: s.sort_order, is_active: s.is_active,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg(''); setError('');
    try {
      if (isEdit) { await api.adminUpdateStore(form.id, form); setMsg('Store updated.'); }
      else        { await api.adminCreateStore(form);          setMsg('Store added.');   }
      reset();
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const remove = async (s) => {
    if (!confirm(`Delete store "${s.name}"?`)) return;
    setMsg(''); setError('');
    try {
      await api.adminDeleteStore(s.id);
      setMsg('Store deleted.');
      if (form.id === s.id) reset();
      load();
    } catch (err) { setError(err.message); }
  };

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h1>Stores</h1>
      </div>

      {msg   && <div className="flash flash-success">{msg}</div>}
      {error && <div className="flash flash-error">{error}</div>}

      <div className="admin-section">
        <h3 style={{ marginTop: 0 }}>{isEdit ? `Edit "${form.name}"` : 'Add Store'}</h3>
        <form onSubmit={submit} className="admin-form">
          <div className="form-row">
            <div className="form-group">
              <label>Store Name *</label>
              <input name="name" required value={form.name} onChange={change} placeholder="e.g. Peacock — Davao" />
            </div>
            <div className="form-group">
              <label>Sort Order</label>
              <input name="sort_order" type="number" value={form.sort_order} onChange={change} />
            </div>
          </div>

          <div className="form-group">
            <label>Address *</label>
            <input name="address" required value={form.address} onChange={change} placeholder="Floor, mall / street, city" />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Opening Hours</label>
              <input name="hours" value={form.hours} onChange={change} placeholder="Mon–Sun 10:00 AM – 9:00 PM" />
            </div>
            <div className="form-group">
              <label>Google Maps Link</label>
              <input name="map_url" value={form.map_url} onChange={change} placeholder="https://maps.google.com/…" />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <input type="checkbox" name="is_active" id="is_active" checked={form.is_active} onChange={change} style={{ width: 'auto' }} />
            <label htmlFor="is_active" style={{ margin: 0 }}>Active (visible on homepage)</label>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button type="submit" className="btn" disabled={loading}>
              {loading ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Store'}
            </button>
            {isEdit && (
              <button type="button" className="btn-ghost" onClick={reset}
                style={{ color: 'var(--blue)', border: '1.5px solid var(--line)', borderRadius: 999 }}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="admin-section">
        <table className="admin-table">
          <thead>
            <tr><th>Sort</th><th>Name</th><th>Address</th><th>Hours</th><th>Active</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {stores.length === 0 ? (
              <tr><td colSpan={6} className="empty">No stores yet.</td></tr>
            ) : stores.map(s => (
              <tr key={s.id}>
                <td>{s.sort_order}</td>
                <td><strong>{s.name}</strong></td>
                <td>{s.address}</td>
                <td>{s.hours}</td>
                <td>{s.is_active ? '✅' : '❌'}</td>
                <td>
                  <button className="tbl-link" onClick={() => edit(s)}>Edit</button>
                  <button className="tbl-link danger" onClick={() => remove(s)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
