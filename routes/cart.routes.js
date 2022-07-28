const { Router } = require('express');

// controllers
const {
	addProduct,
	deleteProduct,
	updateCart,
} = require('../controllers/cart.controllers');

// Middlewares
const { protectSession } = require('../middlewares/auth.middlewares');
const {
	isProductInCart,
	productExistCart,
	cartExist,
} = require('../middlewares/carts.middlewares');
const { validProduct } = require('../middlewares/products.middlewares');

const cartRoutes = Router();

cartRoutes.use(protectSession);
cartRoutes.post('/add-product', addProduct);

cartRoutes.post('');

cartRoutes.patch('/update-cart', updateCart);

cartRoutes.delete('/:productId', deleteProduct);

module.exports = { cartRoutes };
