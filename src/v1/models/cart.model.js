const mongoose = require('mongoose');
const { Schema } = mongoose;

const Cart = new mongoose.Schema(
  {
    username: { type: Schema.Types.String, required: true },
    total: { type: Schema.Types.Number, required: true },
    amount: { type: Schema.Types.Number, required: true },
  },
  {
    timestamps: true,
    collection: 'Cart',
    versionKey: false,
  }
);

module.exports = mongoose.model('Cart', Cart);
