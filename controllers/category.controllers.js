// Models
const { Category } = require('../models/Category.model');

// Utils
const { catchAsync } = require('../utils/catchAsync.utils');

const getAllCategories = catchAsync(async (req, res) => {
	const categories = await Category.findAll({
		where: { status: 'active' },
		attributes: ['id', 'name'],
	});

	res.status(200).json({
		status: 'Success',
		categories,
	});
});

const createCategory = catchAsync(async (req, res) => {
	const { name } = req.body;

	const newCategory = await Category.create({ name });

	res.status(201).json({
		status: 'Success',
		newCategory,
	});
});

const updateCategory = catchAsync(async (req, res) => {
	const { category } = req;
	const { name } = req.body;

	await category.update({ name });

	res.status(200).json({
		status: 'Success',
		msg: 'Category Updated!!!',
	});
});

const deleteCategory = catchAsync(async (req, res) => {
	const { category } = req;

	await category.update({ status: 'inactive' });

	res.status(200).json({
		status: 'Success',
		msg: 'Category Deleted!!!',
	});
});

module.exports = {
	getAllCategories,
	createCategory,
	updateCategory,
	deleteCategory,
};
