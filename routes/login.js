const express = require('express');
const router = express.Router();
const db = require('../conn/conn');
const bcrypt = require('bcrypt');
const session = require('express-session');
const { v4: uuidv4 } = require('uuid');

const app = express();

// TODO: [RD] change send to render and effect sessions

// Session Middleware
app.use(
  session({
    name: 'Login',
    secret: uuidv4(),
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60000, // 1 min
      // secure: false, // must be true if served via HTTPS
    },
  })
);

router
  .route('/')
  .get((req, res) => {
    res.render('login');
  })
  .post((req, res) => {

    db.oneOrNone('SELECT * FROM users WHERE email = $1', [req.body.email.toLowerCase(),])
      // Check if user exists in DB
      .then((isUser) => {
        if (!isUser) {
          return res.send('Invalid User');
        }
        // Compare given password to user's pw in DB
        bcrypt.compare(req.body.password, isUser.password, function (err, result) {
          if (result) {
            res.send('Successful login!');
          } else {
            res.send('Invalid details');
          }
        });
      })
      .catch((e) => {
        console.log(e);
        res.send('Error');
      });
  });

module.exports = router;
