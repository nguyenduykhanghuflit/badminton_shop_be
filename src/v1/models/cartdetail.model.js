const mongoose = require('mongoose');
const { Schema } = mongoose;

const CartDetail = new Schema(
   {
      cartId: { type: Schema.Types.ObjectId, ref: 'Cart', required: true },
      product: {
         productId: { type: Schema.Types.String, required: true },
         name: { type: Schema.Types.String, required: true },
         price: { type: Schema.Types.Decimal128, required: true },
         image: { type: Schema.Types.Array, required: true },
         color: { type: Schema.Types.String, required: false },
         size: { type: Schema.Types.String, required: false },
      },
      quantity: { type: Schema.Types.Number, required: true, default: 1 },
   },
   {
      timestamps: true,
      collection: 'CartDetail',
      versionKey: false,
   }
);

module.exports = mongoose.model('CartDetail', CartDetail);
