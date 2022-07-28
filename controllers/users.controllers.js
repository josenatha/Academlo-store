const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Models
const { User } = require('../models/User.model');
const { Product } = require('../models/Product.model');
const { Category } = require('../models/Category.model');

// Utils
const { AppError } = require('../utils/appError.utils');
const { catchAsync } = require('../utils/catchAsync.utils');

dotenv.config({ path: './config.env' });

const getAllUsers = catchAsync(async (req, res) => {
	const users = await User.findAll({
		where: { status: 'active' },
		attributes: ['id', 'userName', 'email', 'role'],
	});

	res.status(200).json({
		status: 'Succes',
		users,
	});
});

const getAllMyProducts = catchAsync(async (req, res) => {
	const { sessionUser } = req;

	const myProducts = await Product.findAll({
		where: { UserId: sessionUser.id },
		include: [{ model: Category, attributes: ['name'] }],
	});

	res.status(200).json({
		status: 'Succes',
		myProducts,
	});
});

const createUser = catchAsync(async (req, res) => {
	const { userName, email, password } = req.body;

	//hash Password
	const salt = await bcrypt.genSalt(12);
	const hashPassword = await bcrypt.hash(password, salt);

	const newUser = await User.create({
		userName,
		email,
		password: hashPassword,
	});

	newUser.password = undefined;

	res.status(201).json({
		status: 'Succes',
		newUser,
	});
});

const updateUser = catchAsync(async (req, res) => {
	const { user } = req;
	const { userName, email } = req.body;

	await user.update({ userName, email });

	res.status(200).json({
		status: 'Succes',
		msg: 'User Updated!!!',
	});
});

const deleteUser = catchAsync(async (req, res) => {
	const { user } = req;

	await user.update({ status: 'inactive' });

	res.status(200).json({
		status: 'Succes',
		msg: 'User Deleted!!!',
	});
});

const login = catchAsync(async (req, res, next) => {
	const { email, password } = req.body;

	const user = await User.findOne({ where: { email, status: 'active' } });

	if (!user) {
		return next(new AppError('Credentials Invalid', 404));
	}

	const check = await bcrypt.compare(password, user.password);

	if (!check) {
		return next(new AppError('Credentials Invalid', 404));
	}

	// Genetare JWT
	const token = await jwt.sign(
		{
			id: user.id,
		},
		process.env.JWT_SECRET_KEY,
		{
			expiresIn: '30m',
		}
	);

	res.status(200).json({
		status: 'Succes',
		token,
	});
});

module.exports = {
	getAllUsers,
	getAllMyProducts,
	createUser,
	updateUser,
	deleteUser,
	login,
};
