const mongoose = require('mongoose');
const { Schema } = mongoose;
function getDec(value) {
   if (typeof value !== 'undefined') {
      return parseFloat(value.toString());
   }
   return value;
}
const OrderDetail = new mongoose.Schema(
   {
      orderId: { type: Schema.Types.String, required: true },
      amount: { type: Schema.Types.Number, required: true },
      total: { type: Schema.Types.Decimal128, required: true, get: getDec },
      discount: { type: Schema.Types.Decimal128, default: 0, get: getDec },
      shippingFee: { type: Schema.Types.Decimal128, default: 0, get: getDec },
      subTotal: { type: Schema.Types.Decimal128, required: true, get: getDec },
      productName: { type: Schema.Types.String, required: true },
      price: { type: Schema.Types.Decimal128, required: true, get: getDec },
      image: { type: Schema.Types.Array, required: true },
   },
   {
      toJSON: { getters: true },
      timestamps: true,
      collection: 'OrderDetail',
      versionKey: false,
   }
);

module.exports = mongoose.model('OrderDetail', OrderDetail);
