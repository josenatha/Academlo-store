const { Router } = require('express');

// Controllers
const {
	getAllProducts,
	getProductById,
	createProduct,
	updateProduct,
	deleteProduct,
} = require('../controllers/products.controllers');

// Middlewares
const {
	protectSession,
	protectUserProduct,
} = require('../middlewares/auth.middlewares');
const { productValidator } = require('../middlewares/validators.middlewares');
const { productExist } = require('../middlewares/products.middlewares');
const { validCategory } = require('../middlewares/category.middlewares');

const productRoutes = Router();

productRoutes.get('/', getAllProducts);
productRoutes.get('/:id', productExist, getProductById);

//* Restict Routes
productRoutes.use(protectSession);
productRoutes.post('/', validCategory, productValidator, createProduct);

productRoutes
	.use('/:id', productExist, protectUserProduct)
	.route('/:id')
	.patch(productValidator, updateProduct)
	.delete(deleteProduct);

module.exports = { productRoutes };
