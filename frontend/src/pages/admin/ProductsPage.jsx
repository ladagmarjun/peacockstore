import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { api } from '../../services/api';

function fmtPrice(n) { return '₱' + Number(n).toLocaleString('en-PH'); }

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [msg,      setMsg]      = useState('');
  const [error,    setError]    = useState('');

  const load = () => api.adminProducts().then(d => setProducts(d.products)).catch(err => setError(err.message));

  useEffect(() => { load(); }, []);

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      await api.adminDeleteProduct(id);
      setMsg('Product deleted.');
      load();
    } catch (err) { setError(err.message); }
  };

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h1>Products</h1>
        <Link to="/admin/products/new" className="btn-sm">+ New Product</Link>
      </div>

      {msg   && <div className="flash flash-success">{msg}</div>}
      {error && <div className="flash flash-error">{error}</div>}

      <div className="admin-section">
        <table className="admin-table">
          <thead>
            <tr><th>Glyph</th><th>Name</th><th>Brand</th><th>Category</th><th>Price</th><th>Stock</th><th>Tag</th><th>Active</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr><td colSpan={9} className="empty">No products yet.</td></tr>
            ) : products.map(p => (
              <tr key={p.id}>
                <td style={{ fontSize: 22 }}>{p.glyph}</td>
                <td><strong>{p.name}</strong></td>
                <td>{p.brand || '—'}</td>
                <td>{p.category_name}</td>
                <td>{fmtPrice(p.price)}</td>
                <td>{p.stock}</td>
                <td>{p.tag && <span className="status-badge status-processing">{p.tag}</span>}</td>
                <td>{p.is_active ? '✅' : '❌'}</td>
                <td>
                  <Link to={`/admin/products/${p.id}/edit`} className="tbl-link">Edit</Link>
                  <button className="tbl-link danger" onClick={() => handleDelete(p.id, p.name)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
