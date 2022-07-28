const { Router } = require('express');

// controllers
const {
	getAllCategories,
	createCategory,
	updateCategory,
	deleteCategory,
} = require('../controllers/category.controllers');

// Middlewares
const { protectSession } = require('../middlewares/auth.middlewares');
const { categoryExist } = require('../middlewares/category.middlewares');
const { categoryValidator } = require('../middlewares/validators.middlewares');

const categoryRoutes = Router();

categoryRoutes.get('/', getAllCategories);

//* Restict Routes
categoryRoutes.use(protectSession);

categoryRoutes.post('/', categoryValidator, createCategory);

categoryRoutes
	.use('/:id', categoryExist)
	.route('/:id')
	.patch(categoryValidator, updateCategory)
	.delete(deleteCategory);

module.exports = { categoryRoutes };
