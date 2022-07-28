const { body, validationResult } = require('express-validator');

// Utils
const { AppError } = require('../utils/appError.utils');

const checkResult = (req, res, next) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		//! Array has Errors

		const errorMsgs = errors.array().map(({ msg }) => msg);
		const messague = errorMsgs.join('. ');

		return next(new AppError(messague, 404));
	}

	next();
};

const createUserValidator = [
	body('userName').notEmpty().withMessage('Invalid Name'),
	body('email').isEmail().withMessage('Invalid Email'),
	body('password')
		.isAlphanumeric()
		.withMessage('Password must be characters and number')
		.isLength({ min: 8 })
		.withMessage('Password must be a least 8 characters'),
	checkResult,
];

const updateUserValidator = [
	body('userName').notEmpty().withMessage('Invalid Name'),
	body('email').isEmail().withMessage('Invalid Email'),
	checkResult,
];

const productValidator = [
	body('title').notEmpty().withMessage('Invalid title'),
	body('description').notEmpty().withMessage('Invalid description'),
	body('price').isInt({ min: 1 }).withMessage('Please write a number'),
	body('quantity').isInt({ min: 1 }).withMessage('Please write a number'),
	checkResult,
];

const categoryValidator = [
	body('name').notEmpty().withMessage('Invalid Name, Please wite someting'),
	checkResult,
];

module.exports = {
	createUserValidator,
	updateUserValidator,
	productValidator,
	categoryValidator,
};
