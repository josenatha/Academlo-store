const { db, DataTypes } = require('../utils/db.utils');

const Order = db.define('Order', {
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
	CartId: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	totalPrice: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	status: {
		type: DataTypes.ENUM('active', 'inactive'),
		defaultValue: 'active',
	},
});

module.exports = { Order };
