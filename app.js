const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;

const app = express();

const catchErrorsMiddleware = require('./middlewares/catchErrors');

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/mestodb', {});

app.use('/', require('./routes/index'));

app.use(catchErrorsMiddleware);

app.listen(PORT, () => {});
