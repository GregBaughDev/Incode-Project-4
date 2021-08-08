const express = require('express')
const router = express.Router()
const db = require('../conn/conn')

router
    .route('/') 
    .get((req, res) => {
        res.send("Placeholder for reset form")
    })

module.exports = router