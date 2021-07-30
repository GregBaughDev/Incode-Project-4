const express = require('express')
const router = express.Router()
const db = require('../conn/conn')
const {v4: uuidv4} = require('uuid')
const bcrypt = require('bcrypt')

// TODO[GB]: Add UUID as PK when inserting info (uuidv4())
// TODO[GB]: Hash password w/ Bcrypt
