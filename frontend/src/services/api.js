// Origin of the REST API, e.g. https://api.peacock.com. Left empty in dev so
// requests go through the Vite proxy (see vite.config.js).
const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
const BASE = API_URL + '/api';

// The API returns uploaded images as root-relative paths (/uploads/...), which
// must be resolved against the API origin, not the frontend's.
export function assetUrl(url) {
  return url && url.startsWith('/') ? API_URL + url : url;
}

async function request(path, options = {}) {
  const res = await fetch(BASE + path, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

// Public catalog data (categories) is served by the store admin API. It answers
// with `Access-Control-Allow-Origin: *`, so requests must go without cookies,
// and wraps lists in a `{ data: [...] }` envelope.
const CATALOG_URL = (import.meta.env.VITE_CATALOG_API_URL || 'https://storeadmin.peacockgenuineleather.com')
  .replace(/\/$/, '') + '/api';

async function catalogRequest(path) {
  const res = await fetch(CATALOG_URL + path, { headers: { Accept: 'application/json' } });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || 'Request failed');
  return Array.isArray(data) ? data : data.data;
}

async function uploadFile(path, file) {
  const body = new FormData();
  body.append('image', file);
  const res = await fetch(BASE + path, { method: 'POST', credentials: 'include', body });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Upload failed');
  return data;
}

export const api = {
  // Auth
  me:       ()       => request('/auth/me'),
  login:    (body)   => request('/auth/login',    { method: 'POST', body }),
  logout:   ()       => request('/auth/logout',   { method: 'POST' }),

  // Shop
  getCategories: ()       => catalogRequest('/categories'),
  getBrands:     ()       => request('/brands'),
  getStores:     ()       => request('/stores'),
  getBanners:    ()       => request('/banners'),
  getProducts:   (cat)    => request('/products' + (cat && cat !== 'all' ? `?cat=${cat}` : '')),
  getProduct:    (slug)   => request(`/products/${slug}`),
  getProductById:(id)     => request(`/products/id/${id}`),

  // Admin
  adminDashboard:  ()         => request('/admin/dashboard'),
  adminProducts:   ()         => request('/admin/products'),
  adminProduct:    (id)       => request(`/admin/products/${id}`),
  adminCreateProduct: (body)  => request('/admin/products',    { method: 'POST',   body }),
  adminUpdateProduct: (id, b) => request(`/admin/products/${id}`, { method: 'PUT', body: b }),
  adminDeleteProduct: (id)    => request(`/admin/products/${id}`, { method: 'DELETE' }),
  adminUploadImage:   (file)  => uploadFile('/admin/upload', file),
  adminCategories:       ()        => request('/admin/categories'),
  adminCreateCategory:   (body)     => request('/admin/categories',      { method: 'POST', body }),
  adminUpdateCategory:   (id, body) => request(`/admin/categories/${id}`, { method: 'PUT', body }),
  adminDeleteCategory:   (id)       => request(`/admin/categories/${id}`, { method: 'DELETE' }),
  adminBrands:           ()        => request('/admin/brands'),
  adminCreateBrand:      (body)     => request('/admin/brands',      { method: 'POST', body }),
  adminUpdateBrand:      (id, body) => request(`/admin/brands/${id}`, { method: 'PUT', body }),
  adminDeleteBrand:      (id)       => request(`/admin/brands/${id}`, { method: 'DELETE' }),
  adminBanners:       ()        => request('/admin/banners'),
  adminCreateBanner:  (body)     => request('/admin/banners',      { method: 'POST', body }),
  adminUpdateBanner:  (id, body) => request(`/admin/banners/${id}`, { method: 'PUT', body }),
  adminDeleteBanner:  (id)       => request(`/admin/banners/${id}`, { method: 'DELETE' }),
  adminStores:        ()        => request('/admin/stores'),
  adminCreateStore:   (body)     => request('/admin/stores',      { method: 'POST', body }),
  adminUpdateStore:   (id, body) => request(`/admin/stores/${id}`, { method: 'PUT', body }),
  adminDeleteStore:   (id)       => request(`/admin/stores/${id}`, { method: 'DELETE' }),
  adminOrders:     (status)   => request('/admin/orders' + (status ? `?status=${status}` : '')),
  adminOrder:      (id)       => request(`/admin/orders/${id}`),
  adminUpdateOrderStatus: (id, status) => request(`/admin/orders/${id}/status`, { method: 'PATCH', body: { status } }),
  adminUsers:      ()         => request('/admin/users'),
  adminUpdateUser: (id, body) => request(`/admin/users/${id}`, { method: 'PATCH', body }),
};
