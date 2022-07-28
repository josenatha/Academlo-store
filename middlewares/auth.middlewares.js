const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Models
const { User } = require('../models/User.model');

// utils
const { catchAsync } = require('../utils/catchAsync.utils');
const { AppError } = require('../utils/appError.utils');

dotenv.config({ path: './config.env' });

const protectSession = catchAsync(async (req, res, next) => {
	let token;

	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		token = req.headers.authorization.split(' ')[1];
	}

	if (!token) {
		return next(new AppError('Invalid Token', 403));
	}

	// ASK JWT(library), if the token still valid
	const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

	const user = await User.findOne({
		where: { id: decoded.id, status: 'active' },
	});

	if (!user) {
		return next(
			new AppError("The Owner of this token doesn't exist anymore", 403)
		);
	}

	req.sessionUser = user;

	next();
});

const protectUserAccount = (req, res, next) => {
	const { sessionUser, user } = req;

	if (sessionUser.id != user.id) {
		return next(new AppError('That not your User', 403));
	}

	next();
};

const protectUserProduct = (req, res, next) => {
	const { sessionUser, product } = req;

	if (sessionUser.id != product.UserId) {
		return next(new AppError('That not your Product', 403));
	}

	next();
};

module.exports = {
	protectSession,
	protectUserAccount,
	protectUserProduct,
};
