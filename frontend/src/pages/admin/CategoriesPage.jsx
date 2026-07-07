import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { api } from '../../services/api';

const EMPTY = { id: null, name: '', slug: '', sort_order: 0 };

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [form,       setForm]       = useState(EMPTY);
  const [msg,        setMsg]        = useState('');
  const [error,      setError]      = useState('');
  const [loading,    setLoading]    = useState(false);

  const isEdit = Boolean(form.id);

  const load = () => api.adminCategories().then(setCategories).catch(err => setError(err.message));

  useEffect(() => { load(); }, []);

  const change = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const reset = () => { setForm(EMPTY); setError(''); };

  const edit = (c) => {
    setMsg(''); setError('');
    setForm({ id: c.id, name: c.name, slug: c.slug, sort_order: c.sort_order });
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg(''); setError('');
    try {
      if (isEdit) {
        await api.adminUpdateCategory(form.id, form);
        setMsg('Category updated.');
      } else {
        await api.adminCreateCategory(form);
        setMsg('Category added.');
      }
      reset();
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const remove = async (c) => {
    if (!confirm(`Delete category "${c.name}"?`)) return;
    setMsg(''); setError('');
    try {
      await api.adminDeleteCategory(c.id);
      setMsg('Category deleted.');
      if (form.id === c.id) reset();
      load();
    } catch (err) { setError(err.message); }
  };

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h1>Categories</h1>
      </div>

      {msg   && <div className="flash flash-success">{msg}</div>}
      {error && <div className="flash flash-error">{error}</div>}

      <div className="admin-section">
        <h3 style={{ marginTop: 0 }}>{isEdit ? `Edit "${form.name}"` : 'Add Category'}</h3>
        <form onSubmit={submit} className="admin-form">
          <div className="form-row">
            <div className="form-group">
              <label>Name *</label>
              <input name="name" required value={form.name} onChange={change} placeholder="e.g. Wallets" />
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
          <div style={{ display: 'flex', gap: 12 }}>
            <button type="submit" className="btn" disabled={loading}>
              {loading ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Category'}
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
            <tr><th>Sort</th><th>Name</th><th>Slug</th><th>Products</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr><td colSpan={5} className="empty">No categories yet.</td></tr>
            ) : categories.map(c => (
              <tr key={c.id}>
                <td>{c.sort_order}</td>
                <td><strong>{c.name}</strong></td>
                <td><code>{c.slug}</code></td>
                <td>{c.product_count}</td>
                <td>
                  <button className="tbl-link" onClick={() => edit(c)}>Edit</button>
                  <button className="tbl-link danger" onClick={() => remove(c)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
