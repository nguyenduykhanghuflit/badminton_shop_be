const mongoose = require('mongoose');
const { Schema } = mongoose;
function getDec(value) {
   if (typeof value !== 'undefined') {
      return parseFloat(value.toString());
   }
   return value;
}
const Product = new mongoose.Schema(
   {
      name: { type: Schema.Types.String, required: true },
      branchName: { type: Schema.Types.String, required: false },
      stockQty: { type: Schema.Types.Number, required: false },
      categoriesId: { type: Schema.Types.String, required: true },
      description: { type: Schema.Types.String, required: true },
      price: { type: Schema.Types.Decimal128, required: true, get: getDec },
      image: { type: Schema.Types.Array, required: true },
      salePercent: {
         type: Schema.Types.Decimal128,
         required: false,
         default: 0,
         get: getDec,
      },
      color: [
         {
            name: { type: Schema.Types.String, required: false },
            code: { type: Schema.Types.String, required: false },
         },
      ],
      size: { type: Schema.Types.Array, required: false },
   },
   {
      toJSON: { getters: true },
      timestamps: true,
      collection: 'Product',
      versionKey: false,
   }
);

module.exports = mongoose.model('Product', Product);
