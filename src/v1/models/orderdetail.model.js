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
      orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
      amount: { type: Schema.Types.Number, required: true },
      total: { type: Schema.Types.Number, required: true },
      discount: { type: Schema.Types.Number, default: 0 },
      shippingFee: { type: Schema.Types.Number, default: 0 },
      subTotal: { type: Schema.Types.Number, required: true },
      productName: { type: Schema.Types.String, required: true },
      price: { type: Schema.Types.Number, required: true },
      image: { type: Schema.Types.Array, required: true },
   },
   {
      timestamps: true,
      collection: 'OrderDetail',
      versionKey: false,
   }
);

module.exports = mongoose.model('OrderDetail', OrderDetail);
