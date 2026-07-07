import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { api } from '../../services/api';

// Required / recommended cover dimensions.
const REC_W = 1600;
const REC_H = 600;

const EMPTY = {
  id: null, image_url: '', headline: '', subtext: '', link_url: '', sort_order: 0, is_active: true,
};

function readDimensions(file) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload  = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
    img.onerror = () => resolve(null);
    img.src = URL.createObjectURL(file);
  });
}

export default function BannersPage() {
  const [banners,  setBanners]  = useState([]);
  const [form,     setForm]     = useState(EMPTY);
  const [dims,     setDims]     = useState(null);
  const [msg,      setMsg]      = useState('');
  const [error,    setError]    = useState('');
  const [uploading, setUploading] = useState(false);
  const [loading,  setLoading]  = useState(false);

  const isEdit = Boolean(form.id);

  const load = () => api.adminBanners().then(setBanners).catch(err => setError(err.message));
  useEffect(() => { load(); }, []);

  const change = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const reset = () => { setForm(EMPTY); setDims(null); setError(''); };

  const edit = (b) => {
    setMsg(''); setError(''); setDims(null);
    setForm({
      id: b.id, image_url: b.image_url, headline: b.headline || '',
      subtext: b.subtext || '', link_url: b.link_url || '',
      sort_order: b.sort_order, is_active: b.is_active,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const uploadImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    setDims(await readDimensions(file));
    setUploading(true);
    try {
      const { url } = await api.adminUploadImage(file);
      setForm(f => ({ ...f, image_url: url }));
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.image_url) { setError('Please upload a banner image first.'); return; }
    setLoading(true);
    setMsg(''); setError('');
    try {
      if (isEdit) { await api.adminUpdateBanner(form.id, form); setMsg('Banner updated.'); }
      else        { await api.adminCreateBanner(form);          setMsg('Banner added.');   }
      reset();
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const remove = async (b) => {
    if (!confirm('Delete this banner?')) return;
    setMsg(''); setError('');
    try {
      await api.adminDeleteBanner(b.id);
      setMsg('Banner deleted.');
      if (form.id === b.id) reset();
      load();
    } catch (err) { setError(err.message); }
  };

  // Warn if the uploaded image is far from the recommended shape.
  const ratio    = REC_W / REC_H;
  const badRatio = dims && (dims.w < 1200 || Math.abs(dims.w / dims.h - ratio) > 0.35);

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h1>Homepage Slideshow</h1>
      </div>

      {msg   && <div className="flash flash-success">{msg}</div>}
      {error && <div className="flash flash-error">{error}</div>}

      <div className="admin-section">
        <h3 style={{ marginTop: 0 }}>{isEdit ? 'Edit Slide' : 'Add Slide'}</h3>
        <form onSubmit={submit} className="admin-form">
          <div className="form-group">
            <label>Cover Image *</label>
            <p style={{ margin: '0 0 8px', fontSize: 12, color: 'var(--muted)' }}>
              Required size: <b>{REC_W} × {REC_H}px</b> (landscape, JPG/PNG/WEBP, max 5&nbsp;MB). Wider images are cropped to fit.
            </p>
            <input type="file" accept="image/*" onChange={uploadImage} disabled={uploading} />
            {uploading && <span style={{ marginLeft: 10, fontSize: 13 }}>Uploading…</span>}

            {dims && (
              <p style={{ marginTop: 8, fontSize: 12, color: badRatio ? 'var(--red)' : 'var(--muted)' }}>
                Uploaded: {dims.w} × {dims.h}px
                {badRatio && ` — recommended ${REC_W} × ${REC_H}px for a sharp, uncropped cover.`}
              </p>
            )}

            {form.image_url && (
              <div style={{ marginTop: 12 }}>
                <img src={form.image_url} alt="preview"
                  style={{ width: '100%', maxWidth: 520, aspectRatio: `${REC_W} / ${REC_H}`, objectFit: 'cover', borderRadius: 10, border: '1px solid var(--line)' }} />
              </div>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Headline (optional)</label>
              <input name="headline" value={form.headline} onChange={change} placeholder="e.g. New Season Arrivals" />
            </div>
            <div className="form-group">
              <label>Sort Order</label>
              <input name="sort_order" type="number" value={form.sort_order} onChange={change} />
            </div>
          </div>

          <div className="form-group">
            <label>Subtext (optional)</label>
            <input name="subtext" value={form.subtext} onChange={change} placeholder="A short line under the headline" />
          </div>

          <div className="form-group">
            <label>Link when clicked (optional)</label>
            <input name="link_url" value={form.link_url} onChange={change} placeholder="#shop or https://…" />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <input type="checkbox" name="is_active" id="is_active" checked={form.is_active} onChange={change} style={{ width: 'auto' }} />
            <label htmlFor="is_active" style={{ margin: 0 }}>Active (shown in the slideshow)</label>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button type="submit" className="btn" disabled={loading || uploading}>
              {loading ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Slide'}
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
            <tr><th>Sort</th><th>Preview</th><th>Headline</th><th>Active</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {banners.length === 0 ? (
              <tr><td colSpan={5} className="empty">No slides yet.</td></tr>
            ) : banners.map(b => (
              <tr key={b.id}>
                <td>{b.sort_order}</td>
                <td><img src={b.image_url} alt="" style={{ width: 120, height: 45, objectFit: 'cover', borderRadius: 6 }} /></td>
                <td>{b.headline || <span style={{ color: 'var(--muted)' }}>—</span>}</td>
                <td>{b.is_active ? '✅' : '❌'}</td>
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
