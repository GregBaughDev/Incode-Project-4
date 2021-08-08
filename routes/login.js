const express = require('express');
const router = express.Router();
const db = require('../conn/conn');
const bcrypt = require('bcrypt');
const{ redirectToHome } = require('../helpers/middleware');

router
  .route('/')
  .get(redirectToHome, (req, res) => {
    let login = true
    res.render('login', {login})
  })
  .post((req, res) => {
    db.oneOrNone('SELECT * FROM users WHERE email = $1', [req.body.email.toLowerCase(),])
      .then(async (user) => {

        let loginError = "The username and password you entered did not match our records. Please double-check and try again."
        let confirmationError = "Please confirm your email address in your inbox"
        if (user.is_confirmed != 1) return res.render('login', {error: confirmationError})
        if (!user) return res.render('login', {error: loginError})   
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        const oneWeek = 7 * 24 * 3600 * 1000
        if (!validPassword) return res.render('login', {error: loginError})
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

