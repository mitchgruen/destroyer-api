const express = require('express');
const app = express();
const port = 8000;
const cors = require('cors');
app.use(cors());
app.use(express.json());
require('dotenv').config();
const connectDB = require('./config/db.js')
const colors = require('colors');

connectDB();

app.get('/', (req, res) => res.send('Hello World!'));
app.get('/test', (req, res) => res.send('test'));
app.post('/auth', (req, res) => {
  console.log(req.body);
  res.send('Auth Credentials Received');
});
app.listen(port, () => console.log(`Server is running on port ${port}!`));
