import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import session from 'express-session';
import router from './routes/router';
const MongoStore = require('connect-mongo')(session);

const app = express();
// Connect to DB
const dbuser = 'test';
const dbpassword = 'test';
mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://${dbuser}:${dbpassword}@ds215709.mlab.com:15709/test-session`);
mongoose.connection.once('open', () => {
  console.log('Connected to mLab database.');
}).on('error', err => {
  console.log('Error:', err);
});

app.use(express.static('views')); // static assets
// parse POST request
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  })
}));
// use router middeware
app.use('/', router);

// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Express App is running.');
});