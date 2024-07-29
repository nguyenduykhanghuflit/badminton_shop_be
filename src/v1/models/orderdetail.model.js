const mongoose = require('mongoose');
const { Schema } = mongoose;

const OrderDetail = new mongoose.Schema(
   {
      orderId: { type: Schema.Types.String, required: true },
      amount: { type: Schema.Types.Number, required: true },
      total: { type: Schema.Types.Decimal128, required: true },
      discount: { type: Schema.Types.Decimal128, default: 0 },
      shippingFee: { type: Schema.Types.Decimal128, default: 0 },
      subTotal: { type: Schema.Types.Decimal128, required: true },
      productName: { type: Schema.Types.String, required: true },
      price: { type: Schema.Types.Decimal128, required: true },
      image: { type: Schema.Types.Array, required: true },
   },
   {
      timestamps: true,
      collection: 'OrderDetail',
      versionKey: false,
   }
);

module.exports = mongoose.model('OrderDetail', OrderDetail);
