const express = require('express');
const router = express.Router();
const Cart = require('../models/cart.model');
const CartDetail = require('../models/cartdetail.model');
const { authMiddleware } = require('../middleware/auth.middleware');
const { err400, err500, ok } = require('../utils/handleResponse');

router.get('/:username', async (req, res) => {
   const { username } = req.params;

   try {
      const cart = await Cart.findOne({ username });
      if (!cart) {
         return res.status(404).send(err400('Cart not found'));
      }

      const cartDetails = await CartDetail.find({ cartId: cart._id });

      res.send(ok('Cart retrieved successfully', { cart, cartDetails }));
   } catch (err) {
      res.send(err500('Internal Server Error', err));
   }
});

// Add product to cart
router.post('/add', async (req, res) => {
   const { username, product, quantity } = req.body;

   try {
      let cart = await Cart.findOne({ username });
      if (!cart) {
         cart = new Cart({ username, total: 0, amount: 0 });
         await cart.save();
      }

      let cartDetail = await CartDetail.findOne({
         cartId: cart._id,
         'product.productId': product.productId,
         'product.size': product.size,
         'product.color': product.color,
      });

      if (cartDetail) {
         cartDetail.quantity += quantity;
      } else {
         cartDetail = new CartDetail({ cartId: cart._id, product, quantity });
      }

      await cartDetail.save();

      // Update cart total and amount
      const cartDetails = await CartDetail.find({ cartId: cart._id });
      const total = cartDetails.reduce(
         (sum, item) => sum + item.product.price * item.quantity,
         0
      );
      const amount = cartDetails.reduce((sum, item) => sum + item.quantity, 0);

      cart.total = total;
      cart.amount = amount;
      await cart.save();

      res.send(ok('Product added to cart successfully', cartDetail));
   } catch (err) {
      res.send(err500('Internal Server Error', err));
   }
});

// Remove product from cart
router.delete('/remove/:cartDetailId', authMiddleware, async (req, res) => {
   const { cartDetailId } = req.params;

   try {
      const cartDetail = await CartDetail.findByIdAndDelete(cartDetailId);
      if (!cartDetail) {
         return res.send(err400('Product not found in cart'));
      }

      const cart = await Cart.findById(cartDetail.cartId);
      if (!cart) {
         return res.send(err400('Cart not found'));
      }

      // Update cart total and amount
      const cartDetails = await CartDetail.find({ cartId: cart._id });
      const total = cartDetails.reduce(
         (sum, item) => sum + item.product.price * item.quantity,
         0
      );
      const amount = cartDetails.reduce((sum, item) => sum + item.quantity, 0);

      cart.total = total;
      cart.amount = amount;
      await cart.save();

      res.send(ok('Product removed from cart successfully', cartDetail));
   } catch (err) {
      res.send(err500('Internal Server Error', err));
   }
});

// Update product quantity in cart
router.put('/update', authMiddleware, async (req, res) => {
   const { cartDetailId, quantity } = req.body;

   try {
      const cartDetail = await CartDetail.findById(cartDetailId);
      if (!cartDetail) {
         return res.send(err400('Product not found in cart'));
      }

      cartDetail.quantity = quantity;
      await cartDetail.save();

      const cart = await Cart.findById(cartDetail.cartId);
      if (!cart) {
         return res.send(err400('Cart not found'));
      }

      // Update cart total and amount
      const cartDetails = await CartDetail.find({ cartId: cart._id });
      const total = cartDetails.reduce(
         (sum, item) => sum + item.product.price * item.quantity,
         0
      );
      const amount = cartDetails.reduce((sum, item) => sum + item.quantity, 0);

      cart.total = total;
      cart.amount = amount;
      await cart.save();

      res.send(ok('Product quantity updated successfully', cartDetail));
   } catch (err) {
      res.send(err500('Internal Server Error', err));
   }
});

module.exports = router;
