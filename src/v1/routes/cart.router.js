const express = require('express');
const router = express.Router();
const Cart = require('../models/cart.model');
const Products = require('../models/product.model');
const CartDetail = require('../models/cartdetail.model');
const { authMiddleware } = require('../middleware/auth.middleware');
const { handleRespone } = require('../utils/handleResponse');
// Tìm kiếm giỏ hàng của người dùng bằng tên đăng nhập hoặc tạo mới nếu không có
async function findOrCreateCart(email) {
  let cart = await Cart.findOne({ email: email });
  if (!cart) {
    cart = new Cart({ username: email, total: 0, amount: 0 });
    await cart.save();
  }
  return cart;
}

// API lấy giỏ hàng và thêm sản phẩm
router.get('/', authMiddleware, async (req, res) => {
  const { email } = req.user;
  try {
    let cart = await findOrCreateCart({ username: email });
    let { _id } = cart;
    let cartDetail = await CartDetail.find({
      cartId: _id,
    });
    const data = { cart, cartDetail };
    res.send(handleRespone(true, `Success`, data, 200));
  } catch (error) {
    res.send(handleRespone(false, `Server Error ${error}`, null, 500));
  }
  // Tìm kiếm giỏ hàng của người dùng hoặc tạo mới nếu không có
});

router.post('/add', authMiddleware, async (req, res) => {
  const { email } = req.user;
  const { productId, amount } = req.body;

  let cart = await findOrCreateCart(email);

  let product = await Products.findById(productId);
  let cartDetail = await CartDetail.findOne({
    cartId: cart._id,
    'product.productId': productId,
  });

  if (cartDetail) {
    cartDetail.amount += Number(amount);
    cartDetail.total =
      Number(cartDetail.amount) * Number(cartDetail.product.price);
    await cartDetail.save();
  } else {
    const { _id, name, categoriesId, description, price, image } = product;
    cartDetail = new CartDetail({
      cartId: cart._id,
      product: {
        productId: _id,
        name,
        categoriesId,
        description,
        price,
        image,
      },
      amount: amount,
      total: Number(amount) * Number(price),
    });
    await cartDetail.save();
  }

  cart.amount += Number(amount);
  cart.total += Number(cartDetail.total);
  await cart.save();

  const data = await CartDetail.find({
    cartId: cart._id,
  });
  res.send(handleRespone(true, 'Add cart success', data, 200));
});

module.exports = router;
