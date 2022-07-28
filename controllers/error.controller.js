const globalErrorHandler = (err, req, res, next) => {
	const { messague, statusCode = 500, status, stack } = err;

	res.status(statusCode).json({
		status,
		messague,
		stack,
	});
};

module.exports = { globalErrorHandler };
