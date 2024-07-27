const mongoose = require('mongoose');
const { Schema } = mongoose;
const { orderStatus } = require('../utils/orderStatus');
const Order = new mongoose.Schema(
  {
    username: { type: Schema.Types.String, required: true },
    amount: { type: Schema.Types.Number, required: true },
    total: { type: Schema.Types.Number, required: true },
    discount: { type: Schema.Types.Number, default: 0 },
    subTotal: { type: Schema.Types.Number, required: true },
    note: { type: Schema.Types.String },
    address: { type: Schema.Types.String, required: true },
    status: {
      type: Schema.Types.String,
      required: true,
      default: 'waitting',
    },
  },
  {
    timestamps: true,
    collection: 'Order',
    versionKey: false,
  }
);

module.exports = mongoose.model('Order', Order);
