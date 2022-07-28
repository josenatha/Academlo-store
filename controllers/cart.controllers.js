// Models
const { Cart } = require('../models/Cart.model');
const { Product } = require('../models/Product.model');
const { productInCart } = require('../models/productsInCart.model');

//Utils
const { AppError } = require('../utils/appError.utils');
const { catchAsync } = require('../utils/catchAsync.utils');

const addProduct = catchAsync(async (req, res, next) => {
	const { sessionUser } = req;
	const { ProductId, quantity } = req.body;

	const product = await Product.findOne({
		where: { id: ProductId, status: 'active' },
	});

	if (!product) {
		return next(new AppError('Invalid Product', 404));
	} else if (quantity > product.quantity) {
		return next(
			new AppError(
				`This product only has ${product.quantity} items aviable `,
				404
			)
		);
	}

	const cart = await Cart.findOne({
		where: { status: 'active', UserId: sessionUser.id },
	});

	if (!cart) {
		const newCart = await Cart.create({ UserId: sessionUser.id });

		await productInCart.create({
			CartId: newCart.id,
			ProductId: product.id,
			quantity,
		});
	} else {
		const productExist = await productInCart.findOne({
			where: { CartId: cart.id, ProductId },
		});

		if (productExist) {
			next(new AppError('Product is already in the Cart', 400));
		}

		await productInCart.create({
			CartId: cart.id,
			ProductId,
			quantity,
		});
	}

	res.status(200).json({ status: 'Success' });
});

const updateCart = catchAsync(async (req, res) => {
	const { sessionUser } = req;
	const { ProductId, newQty } = req.body;

	const product = await Product.findOne({
		where: { id: ProductId, status: 'active' },
	});

	if (!product) {
		return next(new AppError('Invalid Product', 404));
	} else if (quantity > product.quantity) {
		return next(
			new AppError(
				`This product only has ${product.quantity} items aviable `,
				404
			)
		);
	}

	const cart = await Cart.findOne({
		where: { UserId: sessionUser.id, status: 'active' },
	});

	if (!cart) {
		return next(new AppError('Cart Not Found', 404));
	}

	const productInCart = await productInCart.findOne({
		where: { CartId: cart.id, ProductId, status: 'active' },
	});

	if (!productInCart) {
		return next(new AppError('Product ot Found in cart', 404));
	}

	if (newQty <= 0) {
		await productInCart.update({ quantity: 0, status: 'removed' });
	} else if (newQty > 0) {
		await productInCart.update({ quantity: newQty });
	}

	res.status(200).json({ status: 'Success' });
});

const deleteProduct = catchAsync(async (req, res) => {
	const { sessionUser } = req;
	const { ProductId } = req.params;

	const cart = await Cart.findOne({
		where: { UserId: sessionUser.id, status: 'active' },
	});

	if (!cart) {
		return next(new AppError('Cart not found', 404));
	}

	const productsInCart = await productInCart.findOne({
		CartId: cart.id,
		ProductId,
		status: 'active',
	});

	if (!productsInCart) {
		return next(new AppError('Product not found in cart', 404));
	}

	await productsInCart.update({ status: 'removed', quantity: 0 });

	res.status(200).json({ status: 'success' });
});

const buyCart = catchAsync(async (req, res, next) => {
	const { sessionUser } = req;

	const cart = await Cart.findOne({
		where: { UserId: sessionUser.id, status: 'active' },
		include: [
			{
				model: productInCart,
				required: false,
				where: { status: 'active' },
				include: { model: Product },
			},
		],
	});

	if (!cart) {
		return next(new AppError('Cart not found', 404));
	}

	let totalPrice = 0;

	const productsPurchasedPromises = cart.productInCarts.map(
		async productInCart => {
			const newQty = productInCart.product.quantity - productInCart.quantity;

			const productPrice =
				productInCart.quantity * +productInCart.product.price;

			totalPrice += productPrice;

			await productInCart.product.update({ quantity: newQty });

			return await productInCart.update({ status: 'purchased' });
		}
	);

	await Promise.all(productsPurchasedPromises);

	res.status(200).json({ status: 'success' });
});

module.exports = { addProduct, updateCart, deleteProduct };
