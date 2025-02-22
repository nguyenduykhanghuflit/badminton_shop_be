const express = require('express');
const router = express.Router();
const Order = require('../models/order.model');
const OrderDetail = require('../models/orderdetail.model');
const { authMiddleware } = require('../middleware/auth.middleware');
const { err400, err500, ok } = require('../utils/handleResponse');
const User = require('../models/user.model');
// Create an order
router.post('/', async (req, res) => {
   const {
      username,
      amount,
      total,
      discount,
      subTotal,
      note,
      status,
      orderDetails,
   } = req.body;

   const user = await User.findOne({ email: username });

   if (!user) {
      return res.status(404).send(err400('User not found'));
   }

   const firstAddress = user.information.address[0] || null;
   try {
      const order = new Order({
         username,
         amount,
         total,
         discount,
         subTotal,
         note,
         address: firstAddress || 'Cập nhật sau',
         status,
      });
      await order.save();

      for (const detail of orderDetails) {
         const orderDetail = new OrderDetail({ orderId: order._id, ...detail });
         await orderDetail.save();
      }

      res.send(ok('Order created successfully', order));
   } catch (err) {
      res.send(err500('Internal Server Error', err));
   }
});

// Get orders by username
router.get('/:username', async (req, res) => {
   const { username } = req.params;

   try {
      const orders = await Order.aggregate([
         { $match: { username } },
         {
            $lookup: {
               from: 'OrderDetail',
               localField: '_id',
               foreignField: 'orderId',
               as: 'orderDetails',
            },
         },
      ]);

      if (!orders.length) {
         return res.status(404).send(err400('No orders found'));
      }

      res.send(ok('Orders retrieved successfully', orders));
   } catch (err) {
      res.send(err500('Internal Server Error', err));
   }
});

// Update order status
router.post('/status/:orderId', async (req, res) => {
   const { orderId } = req.params;
   const { status } = req.body;

   try {
      const order = await Order.findById(orderId);
      if (!order) {
         return res.send(err400('Order not found'));
      }

      order.status = status;
      await order.save();

      res.send(ok('Order status updated successfully', order));
   } catch (err) {
      res.send(err500('Internal Server Error', err));
   }
});

module.exports = router;
