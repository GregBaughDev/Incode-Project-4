const express = require('express');
const router = express.Router();
const db = require('../conn/conn');
const bcrypt = require('bcrypt');

// TODO: [RD] change send to render and effect sessions
// TODO: [RD] implement log out with session.destroy() and stay logged in check

router
  .route('/')
  .get((req, res) => {
    if (!req.session.loggedIn) return res.render('login', {title: 'Please log in', showForm: true});
    res.render('login', {title: 'Already logged in', showForm: false})
  })
  .post((req, res) => {
    db.oneOrNone('SELECT * FROM users WHERE email = $1', [req.body.email.toLowerCase(),])
      .then(async (user) => {
        if (!user) return console.log("Invalid details")
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) return console.log("Invalid details")
        if (validPassword){
          req.session.loggedIn = true; 
          res.redirect('/')}
      })
      .catch((e) => {
        console.log(e);
      });
  });

module.exports = router;
