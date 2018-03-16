import express from 'express';
import User from '../models/user';

const router = express.Router();

router.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

router.post('/', (req, res, next) => {
  if (req.body.password !== req.body.passwordConf) {
    const err = new Error('pasdasdas');
    err.status = 400;
    return next(err);
  }
  if (req.body.email && req.body.username &&
    req.body.password && req.body.passwordConf) {

    const userData = {
      email: req.body.email,
      username: req.body.username,
      password: req.body.password
    };

    User(userData).save((error, user) => {
      if (error) return next(error);
      req.session.userId = user._id;
      req.session.cookie.expires = false;
      return res.redirect('/profile');
    });
  } else if (req.body.logemail && req.body.logpassword) {
    User.authenticate(req.body.logemail, req.body.logpassword, (error, user) => {
      if (error || !user) {
        var err = new Error('Wrong email or password.');
        err.status = 401;
        return next(err);
      }
      req.session.userId = user._id;
      req.session.cookie.expires = false;
      return res.redirect('/profile');
    });
  }
});

router.get('/profile', function (req, res, next) {
  User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
          var err = new Error('Not authorized! Go back!');
          err.status = 400;
          return next(err);
        } else {
          return res.send('<h1>Name: </h1>' + user.username + '<h2>Mail: </h2>' + user.email + '<br><a type="button" href="/logout">Logout</a>');
        }
      }
    });
});

router.get('/logout', function (req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});

export default router;