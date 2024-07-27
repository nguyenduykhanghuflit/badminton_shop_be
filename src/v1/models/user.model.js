const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema(
   {
      email: { type: Schema.Types.String, required: true },
      password: { type: Schema.Types.String, required: true },
      information: {
         fullName: { type: Schema.Types.String, required: true },
         phoneNumber: { type: Schema.Types.String, required: true },
         birthday: Schema.Types.Date,
         gender: { type: Schema.Types.String, required: false },
         avtUrl: { type: Schema.Types.String, required: false },
         address: [
            {
               fullAddress: { type: Schema.Types.String, required: false },
               nameAddress: { type: Schema.Types.String, required: false },
               phoneNumber: { type: Schema.Types.String, required: false },
            },
         ],
      },
   },
   {
      timestamps: true,
      collection: 'User',
      versionKey: false,
   }
);

module.exports = mongoose.model('User', UserSchema);
