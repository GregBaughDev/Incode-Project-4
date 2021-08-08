const express = require('express');
const router = express.Router();
const db = require('../conn/conn');
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const Valid = require('../class/validator')

router
    .route('/forgot')
    .get((req, res) => {
        res.render('forgot')
    })

router
    .route('/reset')
    .post((req, res) => {
        let errors = {email: ''}
        const {email} = req.body
        if(email == ''){
            errors.email = "Please enter email"
            res.render('forgot', {errors})
        }
        db.oneOrNone('SELECT * FROM users WHERE email = $1', [email.toLowerCase()])
            .then(async (user) => {
                if(!user){
                    errors.email = "No user with this email exists"
                    res.render('forgot', {errors})
                } else {
                    db.none('UPDATE users SET is_confirmed = B\'0\' WHERE user_id = $1', [user.user_id])
                    .then(async () => {
                        let reset = {success: "Password reset sent - Please check your email"}
                        let transporter = nodemailer.createTransport({
                        host: "smtp.ethereal.email",
                        port: 587,
                        secure: false,
                        auth: {
                            user: 'giuseppe.hickle@ethereal.email',
                            pass: '45vKFHFPatDx567R9R'
                        },
                    })
                        let info = await transporter.sendMail({
                            from: "Mr Coffee <MrCoffee@coffee.com>",
                            to: "Test User <employee@coffee.com>",
                            subject: "Reset your password",
                            text: "Hi there! You requested a password reset. Please click here to reset your password",
                            html: `<h2>Hi there!</h2><p>You requested a password reset, please click <a href="localhost:3000/email/update/${user.user_id}">here</a> to reset your password</p>`,
                        })
                        console.log("Message sent: %s", info.messageId);
                        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
                        res.render('forgot', {reset})
                        })
                    .catch(e => {
                        console.log(e)
                    })
                }
            })
            .catch(e => {
                console.log(e)
            })
    })

router
    .route('/update/:id')
    .get((req, res) => {
        const {id} = req.params
        console.log(id)
        res.render('update', {id})
    })

router
    .route('/update/:id/passwordchange')
    .post((req, res) => {
        const {id} = req.params
        const {newpassword, confirmpassword} = req.body
        
        let errors = {
            passwordmatch: '',
            password: ''
        }
        
        let allTests = true
        const tests = new Valid
        newpassword != confirmpassword ? errors.passwordmatch = "Passwords must match" : null
        newpassword == '' || confirmpassword == '' ? errors.password = "Field must be completed" : null
        !tests.passTest(newpassword) ? errors.password = "Please enter a valid password" : null
        
        for(let key in errors){
            if(errors[key] != ""){
                allTests = false
                return res.render('update', {errors, id})
            } 
        }
        if(allTests){
            const saltRounds = 10
            const salt = bcrypt.genSaltSync(saltRounds)
            const hash = bcrypt.hashSync(newpassword, salt)
            db.none("UPDATE users SET password = $1 WHERE user_id = $2", [hash, id])
                .then(() => {
                    res.render('login')
                })
                .catch(e => {
                    console.log(e)
                })
        }
    })

router
    .route('/:id')
    // Test Route - TO UPDATE
    .get((req, res) => {
        // Retrieve user id from URL - See below
        const {id} = req.params
        // SQL here

        // Redirect to login page once email address is updated
        res.send("USER CONFIRMED!")
    })

module.exports = router