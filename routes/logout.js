const express = require('express');
const router = express.Router();
const{ redirectToLogin } = require('../helpers/middleware');

router.route('/')
      .get(redirectToLogin, (req, res) => {
        req.session.userID = false;
        res.clearCookie('mrCoffeeEmployees')
        req.session.destroy((err) => {
          !err ? res.redirect('/login') : res.send(err.message)
        });
      });

module.exports = router;
