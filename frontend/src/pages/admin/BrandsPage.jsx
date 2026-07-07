import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { api } from '../../services/api';

const EMPTY = { id: null, name: '', slug: '', sort_order: 0, is_active: true };

export default function BrandsPage() {
  const [brands,  setBrands]  = useState([]);
  const [form,    setForm]    = useState(EMPTY);
  const [msg,     setMsg]     = useState('');
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const isEdit = Boolean(form.id);

  const load = () => api.adminBrands().then(setBrands).catch(err => setError(err.message));

  useEffect(() => { load(); }, []);

  const change = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const reset = () => { setForm(EMPTY); setError(''); };

  const edit = (b) => {
    setMsg(''); setError('');
    setForm({ id: b.id, name: b.name, slug: b.slug, sort_order: b.sort_order, is_active: b.is_active });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg(''); setError('');
    try {
      if (isEdit) { await api.adminUpdateBrand(form.id, form); setMsg('Brand updated.'); }
      else        { await api.adminCreateBrand(form);          setMsg('Brand added.');   }
      reset();
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const remove = async (b) => {
    if (!confirm(`Delete brand "${b.name}"?`)) return;
    setMsg(''); setError('');
    try {
      await api.adminDeleteBrand(b.id);
      setMsg('Brand deleted.');
      if (form.id === b.id) reset();
      load();
    } catch (err) { setError(err.message); }
  };

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h1>Brands</h1>
      </div>

      {msg   && <div className="flash flash-success">{msg}</div>}
      {error && <div className="flash flash-error">{error}</div>}

      <div className="admin-section">
        <h3 style={{ marginTop: 0 }}>{isEdit ? `Edit "${form.name}"` : 'Add Brand'}</h3>
        <form onSubmit={submit} className="admin-form">
          <div className="form-row">
            <div className="form-group">
              <label>Name *</label>
              <input name="name" required value={form.name} onChange={change} placeholder="e.g. Peacock Genuine Leather" />
            </div>
            <div className="form-group">
              <label>Slug (URL)</label>
              <input name="slug" value={form.slug} onChange={change} placeholder="auto-generated if empty" />
            </div>
            <div className="form-group">
              <label>Sort Order</label>
              <input name="sort_order" type="number" value={form.sort_order} onChange={change} />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <input type="checkbox" name="is_active" id="is_active" checked={form.is_active} onChange={change} style={{ width: 'auto' }} />
            <label htmlFor="is_active" style={{ margin: 0 }}>Active (shown in the storefront Brands menu)</label>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button type="submit" className="btn" disabled={loading}>
              {loading ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Brand'}
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
            <tr><th>Sort</th><th>Name</th><th>Slug</th><th>Active</th><th>Products</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {brands.length === 0 ? (
              <tr><td colSpan={6} className="empty">No brands yet.</td></tr>
            ) : brands.map(b => (
              <tr key={b.id}>
                <td>{b.sort_order}</td>
                <td><strong>{b.name}</strong></td>
                <td><code>{b.slug}</code></td>
                <td>{b.is_active ? '✅' : '❌'}</td>
                <td>{b.product_count}</td>
                <td>
                  <button className="tbl-link" onClick={() => edit(b)}>Edit</button>
                  <button className="tbl-link danger" onClick={() => remove(b)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
