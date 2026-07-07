const express  = require('express');
const router   = express.Router();
const product  = require('../controllers/shop/productController');
const category = require('../controllers/shop/categoryController');
const brand    = require('../controllers/shop/brandController');
const store    = require('../controllers/shop/storeController');
const banner   = require('../controllers/shop/bannerController');
const order    = require('../controllers/shop/orderController');
const settings = require('../controllers/shop/settingsController');

router.get('/settings',          settings.getSettings);
router.get('/categories',        category.getCategories);
router.get('/brands',            brand.getBrands);
router.get('/stores',            store.getStores);
router.get('/banners',           banner.getBanners);
router.get('/products',          product.getProducts);
router.get('/products/id/:id',   product.getProductById);
router.get('/products/:slug',    product.getProduct);
router.post('/orders',           order.placeOrder);
router.get('/orders/:id',        order.getOrder);

module.exports = router;
