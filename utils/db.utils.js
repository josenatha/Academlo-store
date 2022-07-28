const { Sequelize, DataTypes } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const db = new Sequelize({
	dialect: 'postgres',
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	database: process.env.DB,
	username: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	logging: false,
	dialectOptions:
		process.env.NODE_ENV === 'production'
			? {
					ssl: {
						require: true,
						rejectUnauthorized: false,
					},
			  }
			: {},
});

module.exports = { db, DataTypes };
