// Models
const { Category } = require('../models/Category.model');

// Utils
const { AppError } = require('../utils/appError.utils');
const { catchAsync } = require('../utils/catchAsync.utils');

const categoryExist = catchAsync(async (req, res, next) => {
	const { id } = req.params;

	const category = await Category.findOne({ where: { id } });

	if (!category) {
		return next(new AppError('Category Not Found', 404));
	}

	req.category = category;

	next();
});

const validCategory = catchAsync(async (req, res, next) => {
	const { CategoryId } = req.body;

	const category = await Category.findOne({ where: { id: CategoryId } });

	if (!category) {
		return next(new AppError('Category Not Found', 404));
	}

	req.category = category;

	next();
});

module.exports = {
	categoryExist,
	validCategory,
};
