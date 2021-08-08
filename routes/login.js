const express = require('express');
const router = express.Router();
const db = require('../conn/conn');
const bcrypt = require('bcrypt');
const{ redirectToHome } = require('../helpers/middleware');

router
  .route('/')
  .get(redirectToHome, (req, res) => {
    res.render('login')
  })
  .post((req, res) => {
    db.oneOrNone('SELECT * FROM users WHERE email = $1', [req.body.email.toLowerCase(),])
      .then(async (user) => {
        // TODO: Check that is_confirmed = 1. If not, the user has to register before they can login
        // TODO: Redirect to login page with error details
        if (!user) return console.log("Invalid details")
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        const oneWeek = 7 * 24 * 3600 * 1000
        // TODO: Redirect to login page with error details
        if (!validPassword) return console.log("Invalid details")
        if (validPassword){
          req.session.userID = user.user_id;
          !req.body.remember ? req.session.cookie.expires = false : req.session.cookie.maxAge = oneWeek
          res.redirect('/')}
      })
      .catch((e) => {
        console.log(e);
      });
  });

module.exports = router;
