const express = require('express');
const router = express.Router();
const Products = require('../models/product.model');
const { authMiddleware } = require('../middleware/auth.middleware');
const { handleRespone } = require('../utils/handleResponse');
router.get('/', async (req, res) => {
  const { productId } = req.query;
  const data = productId
    ? await Products.findById(productId)
    : await Products.find();

  res.send(handleRespone(true, 'Success', { total: data.length, data }, 200));
});

// filter product by: name, categories,pageSize
router.get('/filter', async (req, res) => {
  try {
    const { name, category, pageSize } = req.query;
    let query = {};

    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }

    if (category) {
      query.categoriesId = category;
    }

    const products = await Products.find(query).limit(Number(pageSize));
    const total = await (await Products.find(query)).length;

    const data = {
      pageSize: products?.length || 0,
      total: total || 0,
      totalPage: Math.ceil(total / pageSize) || 0,
      data: products || null,
    };
    res.send(handleRespone(true, 'Success', data, 200));
  } catch (err) {
    res.send(handleRespone(true, `Server error ${err}`, null, 500));
  }
});

module.exports = router;
