const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

// Routers
const { userRoutes } = require('./routes/users.routes');
const { productRoutes } = require('./routes/products.routes');
const { categoryRoutes } = require('./routes/categories.routes');
const { cartRoutes } = require('./routes/cart.routes');

const { globalErrorHandler } = require('./controllers/error.controller');
const { AppError } = require('./utils/appError.utils');

const app = express();

app.use(express.json());

const limiter = rateLimit({
	max: 10000,
	windowMs: 60 * 60 * 1000,
	messague: 'Number or request have been exceeded',
});

app.use(limiter);

app.use(helmet());

app.use(compression());

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
else app.use(morgan('combined'));

// Endponits
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/products/categories', categoryRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/cart', cartRoutes);

app.all('*', (req, res, next) => {
	next(
		new AppError(
			`${req.method} ${req.originalUrl} Not Found in this Server`,
			404
		)
	);
});

// global Error Handler
app.use(globalErrorHandler);

module.exports = { app };
