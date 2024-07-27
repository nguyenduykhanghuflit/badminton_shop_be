const express = require('express');
const router = express.Router();
const Categories = require('../models/categoires.model');
const { authMiddleware } = require('../middleware/auth.middleware');
const { handleRespone } = require('../utils/handleResponse');
router.get('/', async (req, res) => {
  const data = await Categories.find();
  res.send(handleRespone(true, 'Success', data, 200));
});

module.exports = router;
