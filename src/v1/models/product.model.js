const mongoose = require('mongoose');
const { Schema } = mongoose;

const Product = new mongoose.Schema(
  {
    name: { type: Schema.Types.String, required: true },
    categoriesId: { type: Schema.Types.String, required: true },
    description: { type: Schema.Types.String, required: true },
    price: { type: Schema.Types.Number, required: true },
    image: { type: Schema.Types.Array, required: true },
  },
  {
    timestamps: true,
    collection: 'Product',
    versionKey: false,
  }
);

module.exports = mongoose.model('Product', Product);
