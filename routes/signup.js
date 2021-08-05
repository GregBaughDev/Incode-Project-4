const express = require('express')
const router = express.Router()
const db = require('../conn/conn')
const bcrypt = require('bcrypt')
const {v4: uuidv4} = require('uuid')
const Valid = require('../class/validator')

router
    .route('/')
    .get((req, res) => {
        res.render('signup')
    })
    .post(async (req, res) => {
        const {first, last, email, pword, pwordcheck} = req.body
        // Valid is a class containing regexs and tests
        const tests = new Valid
        
        // error object created to contain specific errors which can be placed next to input fields 
        let errors = {
            first: "",
            last: "",
            email: "",
            password: "",
            passwordMatch: "",
            userExists: ""
        }
        // Flag to check if validations have all been passed
        let allTests = true

        const checkNewUser = await db.oneOrNone("SELECT * FROM users WHERE email = $1", [email])

        !tests.nameTest(first) ? errors.first = "Please enter a valid name" : null
        !tests.nameTest(last) ? errors.last = "Please enter a valid name" : null
        !tests.emailTest(email) ? errors.email = "Please enter a valid email" : null
        !tests.passTest(pword) ? errors.password = "Please enter a valid password" : null
        pword != pwordcheck ? errors.passwordMatch = "Passwords don't match" : null
        checkNewUser ? errors.userExists = "This email address is already in use" : null        

        /* If the error object contains any errors the user is redirected to signup form, error objects 
        and current user data is passed back to be entered into input fields for better UX */
        for(let key in errors){
            if(errors[key] != ""){
                allTests = false
                const currData = req.body
                return res.render('signup', {errors, currData})
            } 
        }
        
        // If all validations are passed the information is input to DB and user is redirected to login 
        if(allTests){
            const saltRounds = 10
            const salt = bcrypt.genSaltSync(saltRounds)
            const hash = bcrypt.hashSync(pword, salt)
            db.none("INSERT INTO users (user_id, first_name, last_name, email, password) VALUES ($1, $2, $3, $4, $5)", [uuidv4(), first, last, email.toLowerCase(), hash])
                .then(() => {
                    // TODO[GB] Spruce up redirection action, i.e. add registration confirmation
                    res.render('login')
                })
                .catch((e) => {
                    console.log(e)
                })
        }
    })

module.exports = router

