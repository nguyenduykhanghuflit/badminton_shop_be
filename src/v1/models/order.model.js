const mongoose = require('mongoose');
const { Schema } = mongoose;
const { orderStatus } = require('../utils/orderStatus');
function getDec(value) {
   if (typeof value !== 'undefined') {
      return parseFloat(value.toString());
   }
   return value;
}
const Order = new mongoose.Schema(
   {
      username: { type: Schema.Types.String, required: true },
      amount: { type: Schema.Types.Number, required: true },
      total: { type: Schema.Types.Decimal128, required: true, get: getDec },
      discount: { type: Schema.Types.Decimal128, default: 0, get: getDec },
      subTotal: { type: Schema.Types.Decimal128, required: true, get: getDec },
      note: { type: Schema.Types.String },
      address: { type: Schema.Types.String, required: true },
      status: {
         type: Schema.Types.String,
         required: true,
         default: 'waitting',
      },
   },
   {
      toJSON: { getters: true },
      timestamps: true,
      collection: 'Order',
      versionKey: false,
   }
);

module.exports = mongoose.model('Order', Order);
