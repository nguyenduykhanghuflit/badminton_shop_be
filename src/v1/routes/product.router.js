const express = require('express');
const router = express.Router();
const Product = require('../models/product.model');
const { authMiddleware } = require('../middleware/auth.middleware');
const { err400, err500, ok } = require('../utils/handleResponse');

router.get('/detail', async (req, res) => {
   const { productId } = req.query;
   const data = await Product.findById(productId);
   res.send(ok('Success', data));
});

// Get products by categoryId or search by name
router.get('/', async (req, res) => {
   const { categoryId, keyword, productId } = req.query;

   if (productId) {
      const data = await Product.findById(productId);
      res.send(ok('Success', { data }));
   } else {
      let filter = {};
      if (categoryId) {
         filter.categoriesId = categoryId;
      }
      if (keyword) {
         filter.name = { $regex: keyword, $options: 'i' }; // Case-insensitive search
      }

      try {
         const data = await Product.find(filter);
         res.send(ok('Success', { total: data.length, data }));
      } catch (err) {
         res.send(err500('Internal Server Error', err));
      }
   }
});

// Create or update a product
router.post('/', async (req, res) => {
   const {
      id,
      name,
      branchName,
      stockQty,
      categoriesId,
      description,
      price,
      image,
      color,
      size,
      salePercent,
   } = req.body;

   try {
      let product;
      if (id) {
         product = await Product.findByIdAndUpdate(
            id,
            {
               name,
               branchName,
               stockQty,
               categoriesId,
               description,
               price,
               image,
               color,
               size,
               salePercent,
            },
            { new: true, runValidators: true }
         );
         if (!product) return res.status(404).send(err400('Product not found'));
      } else {
         product = new Product({
            name,
            branchName,
            stockQty,
            categoriesId,
            description,
            price,
            image,
            color,
            size,
            salePercent,
         });
         await product.save();
      }
      res.send(ok('Product saved successfully', product));
   } catch (err) {
      res.send(err500('Internal Server Error', err));
   }
});

// Delete a product
router.delete('/:id', async (req, res) => {
   const { id } = req.params;

   try {
      const product = await Product.findByIdAndDelete(id);
      if (!product) return res.status(404).send(err400('Product not found'));
      res.send(ok('Product deleted successfully', product));
   } catch (err) {
      res.send(err500('Internal Server Error', err));
   }
});

module.exports = router;
