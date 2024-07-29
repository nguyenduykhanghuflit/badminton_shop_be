const categories = require('./categories.router');
const products = require('./product.router');
const users = require('./user.router');
const carts = require('./cart.router');
// const orders = require('./order.router');
const initRouter = (app) => {
   app.use('/api/categories', categories);
   app.use('/api/product', products);
   app.use('/api/user', users);
   app.use('/api/cart', carts);
   // app.use('/api/order', orders);
};

module.exports = initRouter;
