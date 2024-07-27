const mongoose = require('mongoose');

//connect mongoose
mongoose
   .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'badminton',
   })
   .then((_) => console.log('Connected mongoose success!...'))
   .catch((err) => console.error(`Error: connect:::`, err));

const db = mongoose.connection;
db.once('open', function () {
   db.db
      .listCollections({ name: 'mycollection' })
      .next(function (err, collinfo) {
         if (!collinfo) {
            db.createCollection('mycollection');
            console.log('Cơ sở dữ liệu đã được tạo!');
         }
      });
});
module.exports = mongoose;
