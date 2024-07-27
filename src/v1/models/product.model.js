const mongoose = require('mongoose');
const { Schema } = mongoose;

const Product = new mongoose.Schema(
   {
      name: { type: Schema.Types.String, required: true },
      branchName: { type: Schema.Types.String, required: false },
      stockQty: { type: Schema.Types.Number, required: false },
      categoriesId: { type: Schema.Types.String, required: true },
      description: { type: Schema.Types.String, required: true },
      price: { type: Schema.Types.Number, required: true },
      image: { type: Schema.Types.Array, required: true },
      color: [
         {
            name: { type: Schema.Types.String, required: false },
            code: { type: Schema.Types.String, required: false },
         },
      ],
      size: { type: Schema.Types.Array, required: false },
   },
   {
      timestamps: true,
      collection: 'Product',
      versionKey: false,
   }
);

module.exports = mongoose.model('Product', Product);
