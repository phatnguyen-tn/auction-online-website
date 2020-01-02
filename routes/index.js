const router = require('express').Router();

const passport = require('passport');
const validInput = require('../middleware/valid');

router.route('/')
    .get((req, res) => {
        res.render('index', { user: req.user });
    })
    .post()
    .put()
    .delete()

router.route('/login')
    .get((req, res) => {
        res.render('login')
    })
    .post(passport.authenticate('login', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    }))
    .put()
    .delete()

router.get('/login/facebook', passport.authenticate('facebook', {
    scope: 'email',
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

router.get('/login/google', passport.authenticate('google', {
    scope: [
        'https://www.googleapis.com/auth/plus.login',
        'https://www.googleapis.com/auth/userinfo.email'
    ],
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

router.route('/register')
    .get((req, res) => {
        res.render('register')
    })
    .post(validInput.validRegister, passport.authenticate('register', {
        successRedirect: '/',
        failureRedirect: '/register',
        failureFlash: true
    }))
    .put()
    .delete()

router.route('/password_reset')
    .get((req, res) => {
        res.render('passwordreset')
    })
    .post()
    .put()
    .delete()

router.route('/logout')
    .get((req, res) => {
        req.logout();
        res.redirect('/login');
    })
    .post()
    .put()
    .delete()

router.route('/wishlist')
    .get()
    .post()
    .put()
    .delete()

module.exports = router;