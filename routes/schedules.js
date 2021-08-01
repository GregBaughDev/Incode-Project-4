const express = require('express')
const router = express.Router()
const db = require('../conn/conn')
const {v4: uuidv4} = require('uuid')

// TODO[GB]: Add UUID as PK when inserting info (uuidv4())
router
    .route('/') 
    .get((req, res) => {
        res.send("Placeholder for schedules")
    })

module.exports = router