const mongoose = require('mongoose');
const { Schema } = mongoose;

const Favorite = new mongoose.Schema(
  {
    username: { type: Schema.Types.String, required: true },
    productName: { type: Schema.Types.String, required: true },
  },
  {
    timestamps: true,
    collection: 'Favorite',
    versionKey: false,
  }
);

module.exports = mongoose.model('Favorite', Favorite);
