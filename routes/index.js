const router = require('express').Router();

const passport = require('passport');
const validInput = require('../middleware/valid');
const captcha = require('../middleware/recaptcha');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

// config
const config = require('../config/config');
const transporter = require('../config/transporter');
const token = require('../config/token-generator');

// models
const User = require('../models/User');
const Token = require('../models/Token');

function fiveMostBidProduct() {

}

function fiveLatestProduct() {

}

function fiveMostPriceProduct() {

}

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
    .post(captcha, validInput.validRegister, passport.authenticate('register', {
        successRedirect: '/',
        failureRedirect: '/register',
        failureFlash: true
    }))
    .put()
    .delete()

router.route('/password_reset/verify')
    .get((req, res) => {
        res.render('confirmpasswordreset');
    })
    .post(validInput.validResetPassword, async (req, res) => {
        // input valid
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash('error', errors.array()[0].msg);
            return res.redirect('back');
        }

        const { newPassword } = req.body;
        try {
            const decode = jwt.verify(req.query.token, 'abc...xyz...example');
        const user = await User.findById(decode.id);
        if (!user) {
            req.flash('error', 'Không đúng người dùng');
            return res.redirect('back');
        }
        const token = Token.findOneAndRemove({ payload: decode.payload });
        if (!token) {
            req.flash('error', 'Không đúng mã xác nhận');
            return res.redirect('back');
        }
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(newPassword, salt);
        user.isVerified = true;
        user.secret = hashPassword;
        await user.save();
        req.flash('success', 'Hãy đăng nhập');
        res.redirect('/login');
        } catch (error) {
            console.error(error.message);
        }
    })

router.route('/password_reset')
    .get((req, res) => {
        res.render('passwordreset', {
            user: req.user
        })
    })
    .post(async (req, res) => {

        const { username, email } = req.body;

        try {
            const user = await User.findOne({ authId: username, 'profile.email': email });
            if (!user) {
                req.flash('error', 'Không tồn tại người dùng');
                return res.redirect('back');
            }
            const newToken = await new Token({
                userId: user.id,
                payload: token(1e5, 1e6 - 1)
            }).save();
            const codeToken = jwt.sign({ id: user.id, payload: newToken.payload }, 'abc...xyz...example');
            await transporter.sendMail({
                from: `"Auction" <${config.EMAIL_USER}>`,
                to: user.profile.email,
                subject: 'Quên mật khẩu',
                html: `
                    <h1>Xin chào ${user.profile.name}</h1>
                    <br>
                    Truy cập link để thay đổi mât khẩu: 
                    <a href="http://localhost:5000/password_reset/verify?token=${codeToken}">Auction web online</a>
                `
            });
            req.flash('success', 'Vui lòng kiểm tra email');
            res.redirect('back');
        } catch (error) {
            console.error(error.message);
        }
    })
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