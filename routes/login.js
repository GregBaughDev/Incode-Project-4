const express = require('express');
const router = express.Router();
const db = require('../conn/conn');
const bcrypt = require('bcrypt');
const{ redirectToHome } = require('../middleware');

router
  .route('/')
  .get(redirectToHome, (req, res) => {
    res.render('login')
  })
  .post(redirectToHome, (req, res) => {
    db.oneOrNone('SELECT * FROM users WHERE email = $1', [req.body.email.toLowerCase(),])
      .then(async (user) => {
        if (!user) return console.log("Invalid details")
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        const oneWeek = 7 * 24 * 3600 * 1000
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
