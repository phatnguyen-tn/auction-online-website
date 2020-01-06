const router = require('express').Router();

const passport = require('passport');
const validInput = require('../middleware/valid');
const captcha = require('../middleware/recaptcha');

const moment = require('moment');

function fiveMostBidProduct(products) {
    var res = products.sort(function(product1, product2){
        return product1.historyBidId.turn.length - product2.historyBidId.turn.length;
    });
    return res;
}

function fiveLatestProduct(products) {
    var res = products.sort(function(product1, product2){
        var temp1 = moment(product1.expDate);
        var dis1 = temp1.diff(moment());
        var temp2 = moment(product2.expDate);
        var dis2 = temp2.diff(moment());
        return dis1 - dis2;
    });
    return res;
}

function fiveMostPriceProduct(products) {
    var res = products.sort(function(product1, product2){
        return product1.currentPrice - product2.currentPrice;
    });
    return res;
}

router.route('/')
    .get((req, res) => {
        var products = res.locals.products;
        var list1 = fiveLatestProduct(products);
        list1 = list1.slice(0, 5);
        var list2 = fiveMostBidProduct(products);
        list2 = list2.slice(0, 5);
        var list3 = fiveMostPriceProduct(products);
        list3 = list3.slice(0, 5);
        var sellDateL1 = [];
        var expDateL1 = [];
        var sellDateL2 = [];
        var expDateL2 = [];
        var sellDateL3 = [];
        var expDateL3 = [];
        list1.forEach(function (product) {
            var temp = moment(product.sellDate);
            sellDateL1.push(temp.fromNow());
            var temp1 = moment(product.expDate);
            expDateL1.push(temp1.fromNow());
        });
        list2.forEach(function (product) {
            var temp = moment(product.sellDate);
            sellDateL2.push(temp.fromNow());
            var temp1 = moment(product.expDate);
            expDateL2.push(temp1.fromNow());
        });
        list3.forEach(function (product) {
            var temp = moment(product.sellDate);
            sellDateL3.push(temp.fromNow());
            var temp1 = moment(product.expDate);
            expDateL3.push(temp1.fromNow());
        });
        res.render('index', { 
            user: req.user,
            list1: list1,
            list2: list2,
            list3: list3,
            sellDateL1: sellDateL1,
            expDateL1: expDateL1,
            sellDateL2: sellDateL2,
            expDateL2: expDateL2,
            sellDateL3: sellDateL3,
            expDateL3: expDateL3
        });
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
    .post(captcha, validInput.validRegister, passport.authenticate('register', {
        successRedirect: '/',
        failureRedirect: '/register',
        failureFlash: true
    }))
    .put()
    .delete()

router.route('/password_reset')
    .get((req, res) => {
        res.render('passwordreset', {
            user: req.user
        })
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

module.exports = router;