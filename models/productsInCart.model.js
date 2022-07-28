const { db, DataTypes } = require('../utils/db.utils');

const productInCart = db.define('productInCart', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
		allowNull: false,
	},
	CartId: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	ProductId: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	quantity: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	status: {
		type: DataTypes.ENUM('active', 'removed'),
		defaultValue: 'active',
	},
});

module.exports = { productInCart };
