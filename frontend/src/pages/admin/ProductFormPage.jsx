import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { api } from '../../services/api';

const GLYPHS = ['👜','🎒','👝','🪢','🧳','💼','🥡'];
const TAGS   = ['', 'New', 'Sale', 'Bestseller'];

const EMPTY = {
  category_id: '', name: '', slug: '', brand: '', description: '',
  price: '', was_price: '', tag: '', leather_type: '', hardware: '',
  dimensions: '', color1: '#7a1414', color2: '#3a2418', color3: '#1c1c1c',
  glyph: '👜', stock: 0, is_active: true, images: [],
  link_shopee: '', link_lazada: '', link_tiktok: '',
};

export default function ProductFormPage() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const isEdit     = Boolean(id);

  const [form,       setForm]       = useState(EMPTY);
  const [categories, setCategories] = useState([]);
  const [brands,     setBrands]     = useState([]);
  const [error,      setError]      = useState('');
  const [loading,    setLoading]    = useState(false);

  useEffect(() => {
    api.adminProducts().then(d => setCategories(d.categories.filter(c => c.slug !== 'all')));
    api.adminBrands().then(setBrands).catch(() => {});
    if (isEdit) {
      api.adminProduct(id).then(({ product, categories: cats }) => {
        const colors = Array.isArray(product.colors) ? product.colors : JSON.parse(product.colors || '[]');
        const images = Array.isArray(product.images) ? product.images : JSON.parse(product.images || '[]');
        const links  = product.links && typeof product.links === 'object' ? product.links : JSON.parse(product.links || '{}');
        setForm({
          ...EMPTY,
          ...product,
          color1: colors[0] || '#7a1414',
          color2: colors[1] || '#3a2418',
          color3: colors[2] || '#1c1c1c',
          was_price: product.was_price || '',
          tag: product.tag || '',
          brand: product.brand || '',
          is_active: product.is_active,
          images,
          link_shopee: links.shopee || '',
          link_lazada: links.lazada || '',
          link_tiktok: links.tiktok || '',
        });
      }).catch(err => setError(err.message));
    }
  }, [id, isEdit]);

  const change = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const [uploading, setUploading] = useState(false);

  const uploadImages = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    setError('');
    try {
      for (const file of files) {
        const { url } = await api.adminUploadImage(file);
        setForm(f => ({ ...f, images: [...f.images, { url, color: f.color1 || '#7a1414' }] }));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      e.target.value = ''; // allow re-selecting the same file
    }
  };

  const setImageColor = (idx, color) =>
    setForm(f => ({ ...f, images: f.images.map((img, i) => i === idx ? { ...img, color } : img) }));

  const removeImage = (idx) =>
    setForm(f => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isEdit) await api.adminUpdateProduct(id, form);
      else        await api.adminCreateProduct(form);
      navigate('/admin/products');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h1>{isEdit ? 'Edit Product' : 'New Product'}</h1>
        <Link to="/admin/products" className="btn-ghost-sm">← Back</Link>
      </div>

      {error && <div className="flash flash-error">{error}</div>}

      <form onSubmit={submit} className="admin-form">
        <div className="form-row">
          <div className="form-group">
            <label>Product Name *</label>
            <input name="name" required value={form.name} onChange={change} />
          </div>
          <div className="form-group">
            <label>Slug (URL)</label>
            <input name="slug" value={form.slug} onChange={change} placeholder="auto-generated if empty" />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Category *</label>
            <select name="category_id" required value={form.category_id} onChange={change}>
              <option value="">Select…</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Tag</label>
            <select name="tag" value={form.tag} onChange={change}>
              {TAGS.map(t => <option key={t} value={t}>{t || 'None'}</option>)}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Brand</label>
            <select name="brand" value={form.brand} onChange={change}>
              <option value="">— None —</option>
              {brands.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
              {form.brand && !brands.some(b => b.name === form.brand) && (
                <option value={form.brand}>{form.brand}</option>
              )}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea name="description" rows={3} value={form.description} onChange={change} />
        </div>

        <div className="form-row">
          <div className="form-group"><label>Price (₱) *</label><input name="price" type="number" required min={0} step={0.01} value={form.price} onChange={change} /></div>
          <div className="form-group"><label>Was Price (₱)</label><input name="was_price" type="number" min={0} step={0.01} value={form.was_price} onChange={change} /></div>
          <div className="form-group"><label>Stock</label><input name="stock" type="number" min={0} value={form.stock} onChange={change} /></div>
        </div>

        <div className="form-row">
          <div className="form-group"><label>Leather Type</label><input name="leather_type" value={form.leather_type} onChange={change} /></div>
          <div className="form-group"><label>Hardware</label><input name="hardware" value={form.hardware} onChange={change} /></div>
          <div className="form-group"><label>Dimensions</label><input name="dimensions" value={form.dimensions} onChange={change} /></div>
        </div>

        <div className="form-row" style={{ alignItems: 'end' }}>
          <div className="form-group">
            <label>Emoji Glyph</label>
            <select name="glyph" value={form.glyph} onChange={change} style={{ fontSize: 22 }}>
              {GLYPHS.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Color 1</label>
            <input type="color" name="color1" value={form.color1} onChange={change} style={{ height: 42, padding: 2 }} />
          </div>
          <div className="form-group">
            <label>Color 2</label>
            <input type="color" name="color2" value={form.color2} onChange={change} style={{ height: 42, padding: 2 }} />
          </div>
          <div className="form-group">
            <label>Color 3</label>
            <input type="color" name="color3" value={form.color3} onChange={change} style={{ height: 42, padding: 2 }} />
          </div>
        </div>

        <div className="form-group">
          <label>Product Photos</label>
          <p style={{ margin: '0 0 8px', fontSize: 12, color: 'var(--muted)' }}>
            Upload photos, then tag each one with the color it shows. Shoppers pick a color and see its photo.
          </p>
          <input type="file" accept="image/*" multiple onChange={uploadImages} disabled={uploading} />
          {uploading && <span style={{ marginLeft: 10, fontSize: 13 }}>Uploading…</span>}

          {form.images.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 14 }}>
              {form.images.map((img, i) => (
                <div key={i} style={{ width: 120, border: '1px solid var(--line)', borderRadius: 10, padding: 8, textAlign: 'center' }}>
                  <img src={img.url} alt="" style={{ width: '100%', height: 90, objectFit: 'cover', borderRadius: 6 }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
                    <input
                      type="color"
                      value={img.color || '#000000'}
                      onChange={(e) => setImageColor(i, e.target.value)}
                      title="Color shown in this photo"
                      style={{ width: 32, height: 28, padding: 1 }}
                    />
                    <span style={{ fontSize: 11, color: 'var(--muted)' }}>{img.color}</span>
                  </div>
                  <button type="button" onClick={() => removeImage(i)} className="tbl-link danger" style={{ marginTop: 6 }}>
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Marketplace Links</label>
          <p style={{ margin: '0 0 8px', fontSize: 12, color: 'var(--muted)' }}>
            Paste this product's page on each marketplace. Leave blank to hide that button on the storefront.
          </p>
          <div className="form-row">
            <div className="form-group">
              <label>🛍️ Shopee</label>
              <input name="link_shopee" type="url" value={form.link_shopee} onChange={change} placeholder="https://shopee.ph/…" />
            </div>
            <div className="form-group">
              <label>🛒 Lazada</label>
              <input name="link_lazada" type="url" value={form.link_lazada} onChange={change} placeholder="https://lazada.com.ph/…" />
            </div>
            <div className="form-group">
              <label>📱 TikTok Shop</label>
              <input name="link_tiktok" type="url" value={form.link_tiktok} onChange={change} placeholder="https://tiktok.com/…" />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <input type="checkbox" name="is_active" id="is_active" checked={form.is_active} onChange={change} style={{ width: 'auto' }} />
          <label htmlFor="is_active" style={{ margin: 0 }}>Active (visible in store)</label>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Product'}
          </button>
          <Link to="/admin/products" className="btn-ghost" style={{ color: 'var(--blue)', border: '1.5px solid var(--line)', borderRadius: 999 }}>Cancel</Link>
        </div>
      </form>
    </AdminLayout>
  );
}
