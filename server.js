const { app } = require('./app');

// Models
const { User } = require('./models/User.model');
const { Product } = require('./models/Product.model');
const { Category } = require('./models/Category.model');
const { Order } = require('./models/Order.model');
const { Cart } = require('./models/Cart.model');
const { productInCart } = require('./models/productsInCart.model');

// DB
const { db } = require('./utils/db.utils');

db.authenticate()
	.then(() => console.log('DataBase Authenticate'))
	.catch(err => console.log(err));

// Establis models Relations
User.hasMany(Product, { foreignKey: 'UserId' });
Product.belongsTo(User);

Category.hasOne(Product, { foreignKey: 'CategoryId' });
Product.belongsTo(Category);

Product.hasOne(productInCart, { foreignKey: 'ProductId' });
productInCart.belongsTo(Product);

Cart.hasOne(productInCart, { foreignKey: 'CartId' });
productInCart.belongsTo(Cart);

User.hasOne(Cart, { foreignKey: 'UserId' });
Cart.belongsTo(User);

User.hasMany(Order, { foreignKey: 'UserId' });
Order.belongsTo(User);

Cart.hasOne(Order, { foreignKey: 'CartId' });
Order.belongsTo(Cart);

db.sync()
	.then(() => console.log('DataBase Synced'))
	.catch(err => console.log(err));

const PORT = process.env.PORT || 4002;
app.listen(PORT, () => console.log('Server Running on PORT:', PORT));
