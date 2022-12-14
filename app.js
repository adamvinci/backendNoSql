const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cookieSession = require('cookie-session');


const authRouter = require('./routes/auths');
const messageRouteur = require('./routes/message');
const pointRouteur = require('./routes/point');


const app = express();
const expiryDateIn3Months = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30 * 3);
const cookieSecreteKey = 'YouWouldnot!not!like!mybelgium';
app.use(
  cookieSession({
    name: 'user',
    keys: [cookieSecreteKey],
    cookie: {
      httpOnly: true,
      expires: expiryDateIn3Months,
    },
  }),
);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.use('/auth', authRouter);
app.use('/message', messageRouteur);
app.use('/point',pointRouteur);



module.exports = app;