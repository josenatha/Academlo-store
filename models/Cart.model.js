const { db, DataTypes } = require('../utils/db.utils');

const Cart = db.define('Cart', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
		allowNull: false,
	},
	UserId: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	status: {
		type: DataTypes.ENUM('active', 'purchase'),
		defaultValue: 'active',
	},
});

module.exports = { Cart };
