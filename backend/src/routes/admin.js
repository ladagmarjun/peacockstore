const express = require('express');
const router  = express.Router();
const admin   = require('../controllers/adminController');
const { requireAdmin } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

router.use(requireAdmin);

router.get('/dashboard',           admin.dashboard);

router.post('/upload',             upload.single('image'), admin.uploadImage);

router.get('/products',            admin.getProducts);
router.post('/products',           admin.createProduct);
router.get('/products/:id',        admin.getProduct);
router.put('/products/:id',        admin.updateProduct);
router.delete('/products/:id',     admin.deleteProduct);

router.get('/categories',          admin.getCategories);
router.post('/categories',         admin.createCategory);
router.put('/categories/:id',      admin.updateCategory);
router.delete('/categories/:id',   admin.deleteCategory);

router.get('/banners',             admin.getBanners);
router.post('/banners',            admin.createBanner);
router.put('/banners/:id',         admin.updateBanner);
router.delete('/banners/:id',      admin.deleteBanner);

router.get('/stores',              admin.getStores);
router.post('/stores',             admin.createStore);
router.put('/stores/:id',          admin.updateStore);
router.delete('/stores/:id',       admin.deleteStore);

router.get('/orders',              admin.getOrders);
router.get('/orders/:id',          admin.getOrder);
router.patch('/orders/:id/status', admin.updateOrderStatus);

router.get('/users',               admin.getUsers);
router.patch('/users/:id',         admin.updateUser);

module.exports = router;
