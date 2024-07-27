const mongoose = require('mongoose');
const { Schema } = mongoose;

const CartDetail = new mongoose.Schema(
  {
    cartId: { type: Schema.Types.String, ref: 'Cart', required: true },
    product: {
      productId: { type: Schema.Types.String, required: true },
      name: { type: Schema.Types.String, required: true },
      categoriesId: { type: Schema.Types.String, required: true },
      description: { type: Schema.Types.String, required: true },
      price: { type: Schema.Types.Number, required: true },
      image: { type: Schema.Types.Array, required: true },
    },
    amount: { type: Schema.Types.Number, required: true },
    total: { type: Schema.Types.Number, required: true },
  },
  {
    timestamps: true,
    collection: 'CartDetail',
    versionKey: false,
  }
);

module.exports = mongoose.model('CartDetail', CartDetail);
