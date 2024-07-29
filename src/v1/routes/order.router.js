// const express = require('express');
// const router = express.Router();
// const Order = require('../models/order.model');
// const Products = require('../models/product.model');
// const OrderDetail = require('../models/orderdetail.model');
// const { authMiddleware } = require('../middleware/auth.middleware');
// const { handleRespone } = require('../utils/handleResponse');
// const { orderStatus } = require('../utils/orderStatus');

// // API lấy giỏ hàng và thêm sản phẩm
// router.get('/', authMiddleware, async (req, res) => {
//   const { email } = req.user; //email is username in order model
//   res.send(email);
// });

// router.post('/', authMiddleware, async (req, res) => {
//   const { email } = req.user; //email is username in order model
//   const { products, address } = req.body;

//   //check product valid
//   if (!Array.isArray(products))
//     return res.send(handleRespone(false, 'Product Invalid', null, 400));

//   const listProduct = [];
//   for (let i = 0; i < products.length; i++) {
//     let product = await Products.findById(products[i].productId);
//     if (product) listProduct.push({ product, amount: products[i].amount });
//     else
//       return res.send(
//         handleRespone(false, `Product Invalid ${products[i]}`, null, 400)
//       );
//   }

//   //handle order

//   const order = new Order({
//     username: email,
//     amount: listProduct.length,
//     total: listProduct.reduce((acc, curr) => {
//       const product = curr.product;
//       const amount = curr.amount;
//       const price = product.price;

//       return acc + Number(amount) * Number(price);
//     }, 0),
//     discount: 0,
//     subTotal: listProduct.reduce((acc, curr) => {
//       const product = curr.product;
//       const amount = curr.amount;
//       const price = product.price;

//       return acc + Number(amount) * Number(price);
//     }, 0),
//     note: '',
//     address,
//   });
//   await order.save();

//   for (let i = 0; i < listProduct.length; i++) {
//     const { product, amount } = listProduct[i];
//     const orderDetail = new OrderDetail({
//       orderId: order._id,
//       amount: amount,
//       total: Number(amount) * Number(product.price),
//       discount: 0,
//       subTotal: Number(amount) * Number(product.price),
//       productName: product.name,
//       price: product.price,
//       image: product.image,
//     });
//     await orderDetail.save();
//   }
//   res.send(handleRespone());
// });

// router.put('/status', authMiddleware, async (req, res) => {
//   const { orderId, status, note } = req.body;

//   const listStatus = orderStatus();
//   if (!listStatus[status])
//     return res.send(handleRespone(false, 'Status Invalid', null, 400));

//   const statusValid = {
//     waitting: ['approve', 'failed'],
//     approve: ['dilivery'],
//     dilivery: ['success', 'failed'],
//     success: [],
//     failed: [],
//   };

//   const order = await Order.findById(orderId);

//   const currentStatus = order.status;
//   if (!statusValid[currentStatus].includes(status))
//     return res.send(handleRespone(false, 'Can not update', null, 400));

//   const orderUpdate = await Order.findOneAndUpdate(
//     { _id: orderId },
//     { status: status, note: note },

//     { new: true }
//   );
//   return res.send(handleRespone(true, 'Update success', orderUpdate, 200));
// });

// module.exports = router;
