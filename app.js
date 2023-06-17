const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '648de0702073d84a082fc843',
  };

  next();
});

app.use('/users', require('./routes/user'));

app.listen(PORT, () => {
  console.log('Сервер запущен!');
});
