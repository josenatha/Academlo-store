const { Router } = require('express');

// Controllers
const {
	createUser,
	updateUser,
	deleteUser,
	getAllUsers,
	login,
	getAllMyProducts,
} = require('../controllers/users.controllers');

// Middlewares
const {
	createUserValidator,
	updateUserValidator,
} = require('../middlewares/validators.middlewares');
const {
	protectSession,
	protectUserAccount,
} = require('../middlewares/auth.middlewares');
const { userExist } = require('../middlewares/users.middlewares');

const userRoutes = Router();

userRoutes.post('/', createUserValidator, createUser);

userRoutes.post('/login', login);

userRoutes.get('/', getAllUsers);

userRoutes.use(protectSession);

userRoutes.get('/me', getAllMyProducts);

userRoutes
	.use('/:id', userExist, protectUserAccount)
	.route('/:id')
	.patch(updateUserValidator, updateUser)
	.delete(deleteUser);

module.exports = { userRoutes };
