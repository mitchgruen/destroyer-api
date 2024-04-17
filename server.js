const express = require('express');
const app = express();
const port = 8000;
const cors = require('cors');
const errorHandler = require('./middleware/error.js');
require('dotenv').config();
const connectDB = require('./config/db.js');
const colors = require('colors');
const { register, login, forgot } = require('./controllers/auth_controller.js');
const requestLogger = require('./middleware/request_logger.js');

app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use(express.static('public'));

connectDB();

app.get('/', (req, res) => res.send('Hello World!'));
app.get('/test', (req, res) => res.send('test'));
// this will be a protected route
// app.get('/saved/:id', protect, getSaved)
app.post('/auth/register', register);
app.post('/auth/login', login);
app.post('/auth/forgot', forgot);
app.use(errorHandler);

const server = app.listen(port, () =>
  console.log(`Server is running on port ${port}!`)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log('in the unhandled promise rejector');
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  server.close(() => {
    // The "1" argument means "exit with failure"
    process.exit(1);
  });
});
