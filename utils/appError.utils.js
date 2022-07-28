class AppError extends Error {
	constructor(messague, statusCode) {
		super(messague);

		this.messague = messague;
		this.statusCode = statusCode;
		this.status = `${statusCode}`.startsWith('5') ? 'fail' : 'error';
		//! 5xx -> fail ---- server Fail
		//! 4xx -> error --- Cliente Error

		Error.captureStackTrace(this, this.constructor);
	}
}

module.exports = { AppError };
