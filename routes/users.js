const express = require('express')
const router = express.Router()
const db = require('../conn/conn')
const {v4: uuidv4} = require('uuid')
const bcrypt = require('bcrypt')

// TODO[GB]: Add UUID as PK when inserting info (uuidv4())
// TODO[GB]: Hash password w/ Bcrypt

router
    .route('/:id')
    .get(async (req, res) => {
        const {id} = req.params
        try {
            const userSearch = await db.one("SELECT * FROM users WHERE user_id = $1", [id])
            const schedSearch = await db.any("SELECT * FROM schedules WHERE user_id = $1", [id])
            res.render('user', {userSearch, schedSearch})
        } catch (e) {
            console.log(e)
        }
    })

module.exports = router
