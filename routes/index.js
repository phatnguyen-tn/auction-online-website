const router = require('express').Router();

const passport = require('passport');
const validInput = require('../middleware/valid');
const controller = require('../controllers/index.controller');

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

router.route('/logout')
    .get((req, res) => {
        req.logout();
        res.redirect('/login');
    })
    .post()
    .put()
    .delete()

// list products
router.route('/products')
    .get(controller.listproduct)
    .post()
    .put()
    .delete()

router.route('/products/:id')
    .get(controller.productdetail)
    .post()
    .put()
    .delete()

router.route('/products/bidhistory/:id')
    .get(controller.productdetail)
    .post()
    .put()
    .delete()

router.route('/user')
    .get(controller.user)
    .post()
    .put()
    .delete()

router.route('/user/update')
    .get(controller.updateProfile)
    .post()
    .put()
    .delete()

router.route('/user/post')
    .get(controller.post)
    .post(controller.postProduct)
    .put()
    .delete()

// router.route('/:name')
//     .get(controller.productdetail)
//     .post()
//     .put()
//     .delete()

// router.route('/:name/review')
//     .get(controller.productdetail)
//     .post()
//     .put()
//     .delete()


module.exports = router;