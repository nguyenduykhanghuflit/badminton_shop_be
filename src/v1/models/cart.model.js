const mongoose = require('mongoose');
const { Schema } = mongoose;

function getDec(value) {
   if (typeof value !== 'undefined') {
      return parseFloat(value.toString());
   }
   return value;
}

const Cart = new mongoose.Schema(
   {
      username: { type: Schema.Types.String, required: true },
      total: { type: Schema.Types.Decimal128, required: true, get: getDec },
      amount: { type: Schema.Types.Number, required: true },
   },

   {
      toJSON: { getters: true },
      timestamps: true,
      collection: 'Cart',
      versionKey: false,
   }
);

module.exports = mongoose.model('Cart', Cart);
