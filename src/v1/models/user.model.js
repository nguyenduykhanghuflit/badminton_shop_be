const mongoose = require('mongoose');
const { Schema } = mongoose;

const User = new mongoose.Schema(
  {
    email: { type: Schema.Types.String, required: true },
    password: { type: Schema.Types.String, required: true },
    information: {
      fullName: { type: Schema.Types.String, required: true },
      phoneNumber: { type: Schema.Types.String, required: true },
      dateOfBirth: Schema.Types.Date,
      gender: { type: Schema.Types.Boolean, required: true },
      address: { type: Schema.Types.String, required: true },
    },
  },
  {
    timestamps: true,
    collection: 'User',
    versionKey: false,
  }
);

module.exports = mongoose.model('User', User);
