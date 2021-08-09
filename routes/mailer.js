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
    // Route to handle password reset
    .route('/reset')
    .post((req, res) => {
        let errors = {email: ''}
        const {email} = req.body
        if(email == ''){
            errors.email = "Please enter email"
            res.render('forgot', {errors})
        }
        db.oneOrNone('SELECT * FROM users WHERE email = $1', [email.toLowerCase()])
            // If no user is associated with the email address, user is informed
            .then(async (user) => {
                if(!user){
                    errors.email = "No user with this email exists"
                    res.render('forgot', {errors})
                } else {
                    /* If user does exist, is_confirmed to false so they are unable to login while
                    they are updating their password */
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
                            to: `${user.first_name} ${user.last_name} <${user.email}>'`,
                            subject: "Reset your password",
                            text: "Hi there! You requested a password reset. Please click here to reset your password",
                            html: `<h2>Hi there!</h2><p>You requested a password reset, please click <a href="http://localhost:3000/email/update/${user.user_id}">here</a> to reset your password</p>`,
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
    // This route handles the link from the reset email. User is redirected to form to enter new password
    .route('/update/:id')
    .get((req, res) => {
        const {id} = req.params
        res.render('update', {id})
    })

router
    // This route handles the password change and validations. If all validations are passed, new email is input to database
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
            db.none("UPDATE users SET password = $1, is_confirmed = B'1' WHERE user_id = $2 ", [hash, id])
                .then(() => {
                    res.render('login')
                })
                .catch(e => {
                    console.log(e)
                })
        }
    })

router
    // This route handles new user confirmation link from email
    .route('/:id')
    .get((req, res) => {
        const {id} = req.params
        db.none("UPDATE users SET is_confirmed = B'1' WHERE user_id = $1 ", [id])
                .then(() => {
                    let confirmed = true
                    res.render('login', {confirmed})
                })
                .catch(e => {
                    console.log(e)
                })
        })

module.exports = router

