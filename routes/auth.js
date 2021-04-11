const express = require('express');
const router = express.Router();
const auth = require('../utils/auth');
const passport = require('passport');
const passwordStrength = require('check-password-strength');

//password strength checker

const checkpassword = function checkpassword(password) {
    var strength = 0;
    if (password.match(/[a-z]+/)) {
      strength += 1;
    }
    if (password.match(/[A-Z]+/)) {
      strength += 1;
    }
    if (password.match(/[0-9]+/)) {
      strength += 1;
    }
    if (password.match(/[$@#&!]+/)) {
      strength += 1;
    }
  
    if (password.length < 6) {
      return -1;
    }
    console.log("HELLLLLOOOOOO: ", strength);
    return strength;
}

router.get('/login', (req, res, next) => {
    const messages = req.flash();
    res.render('login', { messages });
});

router.post('/login', passport.authenticate('local', 
{ failureRedirect: '/auth/login', failureFlash: "Incorrect username or passowrd"}),
 (req, res, next) => {
     res.redirect('/users');
 });

 router.get('/register', (req, res, next) => {
     const messages = req.flash();
     res.render('register', { messages });
 })

 router.post('/register', (req, res, next) => {
    const registration_params = req.body;
    const users = req.app.locals.users;
    const db_load = {
        username: registration_params.username,
        password: auth.hashPassword(registration_params.password),
    };
    const raw_password = registration_params.password;
    // if(checkpassword(registration_params.password) > 4){
    //     req.flash('error', 'Password must be more than 6 characters and contain a lowercase, uppercase, numerical, and special character');
    // }
    users.insertOne(db_load, (err) => {
        if(err){
            req.flash('error', 'Error: User account is not unique');
        }else{
            req.flash('success', 'Account created successfully');
        }

        res.redirect('/users');
    });
 });

 router.get('/logout', (req, res, next) => {
     req.session.destroy();
     res.redirect('/');
 });
 module.exports = router;
