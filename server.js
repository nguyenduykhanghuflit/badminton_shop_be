require('dotenv').config();
const app = require('./src/app');

const { PORT } = process.env;

const server = app.listen(PORT, () => {
  console.log(`Server is started at http://localhost:${PORT}`);
});

process.on('SIGINT', () => {
  server.close(() => console.log(`exits server express`));
});
