const express = require('express');
const app = express();
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const cors = require('cors');
var path = require('path');
//init dbs
require('./v1/databases/init.mongodb');
// const models = require('./v1/models');

//user middleware
app.use(helmet());
app.use(morgan('combined'));
app.use(cors({ credentials: true, origin: true }));
// compress responses
app.use(compression());

// add body-parser
app.use(express.json());
app.use(
   express.urlencoded({
      extended: true,
   })
);

//router

app.use('/images', express.static(path.join(__dirname, 'v1/public/images')));
const initRouter = require('./v1/routes/index.router');
initRouter(app);

// Error Handling Middleware called

app.use((req, res, next) => {
   const error = new Error('Not found');
   error.status = 404;
   next(error);
});

// error handler middleware
app.use((error, req, res, next) => {
   res.status(error.status || 500).send({
      error: {
         status: error.status || 500,
         message: error.message || 'Internal Server Error',
      },
   });
});

module.exports = app;
