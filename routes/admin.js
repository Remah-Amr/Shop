const express = require('express'); 
const router = express.Router();
const path = require('path');
const adminControllers = require('../controllers/admin');
// const isAuth = require('../middleware/isAuth');
const {ensureAuthenticated} = require('../helpers/auth');
const {check} = require('express-validator'); // you can also extract body or any part of request object to make certain search
// /admin/add-product => GET
router.get('/add-product',ensureAuthenticated, adminControllers.getAddProduct); // move from left to write to check every middleWare 

// /admin/products 
router.get('/products',ensureAuthenticated,adminControllers.getProducts);

router.post('/add-product',/*check('imageUrl').isURL().withMessage('ImageUrl must be A link!'),*/check('price').isNumeric().withMessage('Price Must Be Numbers Only!'),ensureAuthenticated,adminControllers.postAddProduct);

router.get('/edit-product/:productId',ensureAuthenticated,adminControllers.getEditProduct);

router.post('/edit-product',/*check('imageUrl').isURL().withMessage('ImageUrl must be A link!'),*/check('price').isNumeric().withMessage('Price Must Be Numbers Only!'),ensureAuthenticated,adminControllers.postEditProduct); // if i post the action edit-product what happen ? here

router.post('/delete-product',ensureAuthenticated,adminControllers.postDeleteProduct);

module.exports = router;
