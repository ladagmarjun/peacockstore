const express = require('express');
const router  = express.Router();
const shop    = require('../controllers/shopController');

router.get('/categories',        shop.getCategories);
router.get('/stores',            shop.getStores);
router.get('/banners',           shop.getBanners);
router.get('/products',          shop.getProducts);
router.get('/products/id/:id',   shop.getProductById);
router.get('/products/:slug',    shop.getProduct);
router.post('/orders',           shop.placeOrder);
router.get('/orders/:id',        shop.getOrder);

module.exports = router;
