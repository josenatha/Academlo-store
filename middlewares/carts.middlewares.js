// Modelc
const { Cart } = require('../models/Cart.model');
const { Product } = require('../models/Product.model');
const { productInCart } = require('../models/productsInCart.model');

// Utils
const { AppError } = require('../utils/appError.utils');
const { catchAsync } = require('../utils/catchAsync.utils');

const cartExist = catchAsync(async (req, res, next) => {
	const { sessionUser } = req;

	const userCart = await Cart.findOne({
		where: { UserId: sessionUser.id, status: 'active' },
	});

	req.userCart = userCart;

	next();
});

const isProductInCart = catchAsync(async (req, res, next) => {
	const { product, userCart } = req;

	const cartWithProduct = await productInCart.findOne({
		where: { CartId: userCart.id, ProductId: product.id },
	});

	if (!cartWithProduct) {
		return next(new AppError('The product is not In this cart', 404));
	}

	req.cartWithProduct = cartWithProduct;

	next();
});

const productExistCart = catchAsync(async (req, res, next) => {
	const { productId } = req.params;

	const product = await Product.findOne({
		where: { id: productId, status: 'active' },
	});

	if (!product) {
		return next(new AppError('Prodcut Not Found', 404));
	}

	req.product = product;

	next();
});

module.exports = { isProductInCart, cartExist, productExistCart };
