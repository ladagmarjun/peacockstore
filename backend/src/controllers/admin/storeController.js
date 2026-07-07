const Store = require('../../models/Store');

exports.getStores = async (req, res, next) => {
  try {
    const stores = await Store.findAll();
    res.json(stores);
  } catch (err) { next(err); }
};

exports.createStore = async (req, res, next) => {
  try {
    const data = buildStoreData(req.body);
    if (!data.name || !data.address) return res.status(400).json({ error: 'Store name and address are required.' });
    const store = await Store.create(data);
    res.status(201).json(store);
  } catch (err) { next(err); }
};

exports.updateStore = async (req, res, next) => {
  try {
    const data = buildStoreData(req.body);
    if (!data.name || !data.address) return res.status(400).json({ error: 'Store name and address are required.' });
    const store = await Store.update(req.params.id, data);
    if (!store) return res.status(404).json({ error: 'Store not found.' });
    res.json(store);
  } catch (err) { next(err); }
};

exports.deleteStore = async (req, res, next) => {
  try {
    await Store.delete(req.params.id);
    res.json({ success: true });
  } catch (err) { next(err); }
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function buildStoreData(body) {
  return {
    name:       (body.name || '').trim(),
    address:    (body.address || '').trim(),
    hours:      (body.hours || '').trim() || 'Mon–Sun 10:00 AM – 9:00 PM',
    map_url:    (body.map_url || '').trim() || null,
    sort_order: parseInt(body.sort_order) || 0,
    is_active:  body.is_active === true || body.is_active === 'true',
  };
}
