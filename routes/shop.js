const path = require('path');

const express = require('express');

const router = express.Router();

const shopControllers = require('../controllers/shop');

// const isAuth = require('../middleware/isAuth');

const {ensureAuthenticated} = require('../helpers/auth'); // destructuring

router.get('/', shopControllers.getIndex);

router.get('/products',shopControllers.getProducts);
 
router.get('/cart',ensureAuthenticated,shopControllers.getCart); // router move from left to right 

 router.post('/cart',ensureAuthenticated,shopControllers.postCart);

// router.post('/create-order',ensureAuthenticated,shopControllers.postOrder);

router.get('/checkout',shopControllers.getCheckout);

router.get('/orders',ensureAuthenticated,shopControllers.getOrders);

router.get('/orders/:orderId',ensureAuthenticated,shopControllers.getInvoice);


router.get('/products/:productId',shopControllers.getProduct); // put after : any var with our choice not specific name,
// // if you have specific route with same name put it first before dynamic (because dynamic route will fire)

 router.post('/cart-delete-item',ensureAuthenticated,shopControllers.postCartDeleteProduct);

module.exports = router;