const mongoose = require('mongoose');
const { Schema } = mongoose;

const Categories = new mongoose.Schema(
   {
      title: { type: Schema.Types.String, required: true },
      urlImage: { type: Schema.Types.String, required: false },
   },
   {
      timestamps: true,
      collection: 'Categories',
      versionKey: false,
   }
);

module.exports = mongoose.model('Categories', Categories);
