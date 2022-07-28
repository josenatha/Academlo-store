//Model
const { Product } = require('../models/Product.model');

// Utils
const { AppError } = require('../utils/appError.utils');
const { catchAsync } = require('../utils/catchAsync.utils');

const productExist = catchAsync(async (req, res, next) => {
	const { id } = req.params;

	const product = await Product.findOne({ where: { id, status: 'active' } });

	if (!product) {
		return next(new AppError('Prodcut Not Found', 404));
	}

	req.product = product;

	next();
});

const validProduct = catchAsync(async (req, res, next) => {
	const { ProductId } = req.body;

	const product = await Product.findOne({
		where: { id: ProductId, status: 'active' },
	});

	if (!product) {
		return next(new AppError('Prodcut Not Found', 404));
	}

	req.product = product;

	next();
});

module.exports = { productExist, validProduct };
