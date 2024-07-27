const express = require('express');
const router = express.Router();
const Category = require('../models/category.model');
const { authMiddleware } = require('../middleware/auth.middleware');
const { err400, err500, ok } = require('../utils/handleResponse');

// Get all categories
router.get('/', async (req, res) => {
   try {
      const categories = await Category.find();
      res.send(ok('Success', { total: categories.length, data: categories }));
   } catch (err) {
      res.send(err500('Internal Server Error', err));
   }
});

// Create or update a category
router.post('/', async (req, res) => {
   const { id, title, urlImage } = req.body;

   try {
      let category;
      if (id) {
         category = await Category.findByIdAndUpdate(
            id,
            { title, urlImage },
            { new: true, runValidators: true }
         );
         if (!category) return res.send(err400('Category not found'));
      } else {
         category = new Category({ title, urlImage });
         await category.save();
      }
      res.send(ok('Category saved successfully', category));
   } catch (err) {
      res.send(err500('Internal Server Error', err));
   }
});

// Delete a category
router.delete('/:id', async (req, res) => {
   const { id } = req.params;

   try {
      const category = await Category.findByIdAndDelete(id);
      if (!category) return res.status(404).send(err400('Category not found'));
      res.send(ok('Category deleted successfully', category));
   } catch (err) {
      res.send(err500('Internal Server Error', err));
   }
});

module.exports = router;
