// models
const { Product } = require('../models/Product.model');
const { User } = require('../models/User.model');
const { Category } = require('../models/Category.model');

// utils
const { catchAsync } = require('../utils/catchAsync.utils');

const getAllProducts = catchAsync(async (req, res) => {
	const products = await Product.findAll({
		where: { status: 'active' },
		attributes: ['id', 'title', 'description', 'quantity', 'price'],
		include: [
			{ model: User, attributes: ['id', 'userName'] },
			{ model: Category, attributes: ['name'] },
		],
	});

	res.status(200).json({
		status: 'Succes',
		products,
	});
});

const getProductById = catchAsync(async (req, res) => {
	const { product } = req;

	res.status(200).json({
		status: 'Succes',
		product,
	});
});

const createProduct = catchAsync(async (req, res) => {
	const { sessionUser } = req;
	const { title, description, quantity, price, CategoryId } = req.body;

	const newProduct = await Product.create({
		title,
		description,
		quantity,
		price,
		CategoryId,
		UserId: sessionUser.id,
	});

	res.status(201).json({
		status: 'Success',
		newProduct,
	});
});

const updateProduct = catchAsync(async (req, res) => {
	const { product } = req;
	const { title, description, quantity, price } = req.body;

	await product.update({
		title,
		description,
		quantity,
		price,
	});

	res.status(200).json({
		status: 'Succes',
		msg: 'Product Updated!!!',
	});
});

const deleteProduct = catchAsync(async (req, res) => {
	const { product } = req;

	await product.update({
		status: 'inactive',
	});

	res.status(200).json({
		status: 'Succes',
		msg: 'Product deleted!!!',
	});
});

module.exports = {
	getAllProducts,
	getProductById,
	createProduct,
	updateProduct,
	deleteProduct,
};
