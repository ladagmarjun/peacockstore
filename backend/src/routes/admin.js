const express   = require('express');
const router    = express.Router();
const dashboard = require('../controllers/admin/dashboardController');
const product   = require('../controllers/admin/productController');
const category  = require('../controllers/admin/categoryController');
const store     = require('../controllers/admin/storeController');
const banner    = require('../controllers/admin/bannerController');
const order     = require('../controllers/admin/orderController');
const user      = require('../controllers/admin/userController');
const { requireAdmin } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

router.use(requireAdmin);

router.get('/dashboard',           dashboard.dashboard);

router.post('/upload',             upload.single('image'), product.uploadImage);

router.get('/products',            product.getProducts);
router.post('/products',           product.createProduct);
router.get('/products/:id',        product.getProduct);
router.put('/products/:id',        product.updateProduct);
router.delete('/products/:id',     product.deleteProduct);

router.get('/categories',          category.getCategories);
router.post('/categories',         category.createCategory);
router.put('/categories/:id',      category.updateCategory);
router.delete('/categories/:id',   category.deleteCategory);

router.get('/banners',             banner.getBanners);
router.post('/banners',            banner.createBanner);
router.put('/banners/:id',         banner.updateBanner);
router.delete('/banners/:id',      banner.deleteBanner);

router.get('/stores',              store.getStores);
router.post('/stores',             store.createStore);
router.put('/stores/:id',          store.updateStore);
router.delete('/stores/:id',       store.deleteStore);

router.get('/orders',              order.getOrders);
router.get('/orders/:id',          order.getOrder);
router.patch('/orders/:id/status', order.updateOrderStatus);

router.get('/users',               user.getUsers);
router.patch('/users/:id',         user.updateUser);

module.exports = router;
