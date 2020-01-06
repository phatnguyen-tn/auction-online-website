const router = require('express').Router();

const token = require('../config/token-generator');
const bcrypt = require('bcryptjs');

//middleware auth
const auth = require('../middleware/auth.middleware');
const validInput = require('../middleware/valid');
const verify = require('../middleware/verify');
const { validationResult } = require('express-validator');

const Token = require('../models/Token');
const transporter = require('../config/transporter');
const config = require('../config/config');

//multer
const multer = require('multer')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
})
const upload = multer({ storage });

// multer update profile
const path = require('path');
const storageUpdateProfile = multer.diskStorage({
  destination: './public/images/users/',
  filename: (req, file, cb) => {
    cb(null, req.user.id + path.extname(file.originalname));
  }
})
const uploadAvt = multer({
  storage: storageUpdateProfile
});

const controller = require('../controllers/user.controller');

// user model
const User = require('../models/User');

router.route('/')
  .get(auth, verify, controller.user)
  .post()
  .put()
  .delete()

router.route('/email/verify')
  .get(auth, (req, res) => res.render('verifyemail', { user: req.user }))
  .post(auth, async (req, res) => {
    try {
      const token = await Token.findOneAndRemove({
        userId: req.user.id,
        payload: req.body.code
      });
      if (!token) {
        req.flash('error', 'Mã xác nhận không đúng');
        return res.redirect('back');
      }
      await User.findByIdAndUpdate(req.user.id, { isVerified: true });
      res.redirect('/');
    } catch (error) {
      console.error(error.message);
    }
  })

router.route('/email/verify/resend')
  .get(auth, async (req, res) => {
    try {
      // create new token
      const code = await new Token({
        userId: req.user.id,
        payload: token(1e5, 1e6 - 1)
      }).save();
      // send email
      await transporter.sendMail({
        from: `"Auction" <${config.EMAIL_USER}>`,
        to: req.user.profile.email,
        subject: 'Xác thực email',
        html: `
                <h1>Xin chào ${req.user.profile.name}</h1>
                <br>
                Đây là mã xác thực email cho tài khoản của bạn: <h1 style="color:blue">${code.payload.toString()}</h1>
            `
      });
      req.flash('success', 'Đã gửi lại email');
      res.redirect('back');
    } catch (error) {
      console.error(error.message);
    }
  })
  .post()

router.route('/update')
  .get(auth, verify, controller.updateProfile)
  .post(auth, verify, uploadAvt.single('avatar'), validInput.validUpdateProfile, async (req, res, next) => {
    // input valid
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('error', errors.array()[0].msg);
      return res.redirect('back');
    }

    const { name, email, address } = req.body;
    try {
      const checkEmail = await User.findOne({ method: req.user.method, 'profile.email': email });
      if (checkEmail) {
        req.flash('error', 'Email đã được sử dụng');
        return res.redirect('back');
      }
      const user = await User.findByIdAndUpdate(req.user.id, {
        profile: { name, email, address }
      });
      if (!user) {
        req.flash('error', 'Không tồn tại người dùng');
        return res.redirect('back');
      }
      req.flash('success', 'Thay đổi profile thành công');
      res.redirect('back');
      next();
    } catch (error) {
      console.error(error.message);
    }
  })
  .put()
  .delete()

router.route('/changepassword')
  .get(auth, (req, res) => {
    res.render('changepassword', {
      user: req.user
    })
  })
  .post(auth, validInput.validChangePassword, async (req, res) => {

    // input valid
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('error', errors.array()[0].msg);
      return res.redirect('back');
    }

    const { oldPassword, newPassword } = req.body;

    try {
      const isMatch = await bcrypt.compare(oldPassword, req.user.secret);
      if (!isMatch) {
        req.flash('error', 'Mật khẩu không đúng');
        return res.redirect('back');
      }
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(newPassword, salt);
      await User.findByIdAndUpdate(req.user.id, { secret: hashPassword });
      req.flash('success', 'Đổi mật khẩu thành công');
      res.redirect('back');
    } catch (error) {
      console.error(error.message);
    }
  })
  .put()
  .delete()

router.route('/upgraderole')
  .get(auth, controller.upgradeRole)
  .post()
  .put()
  .delete()

router.route('/post')
  .get(auth, controller.post)
  .post(auth, upload.array('avatar', 10), controller.postProduct)
  .put()
  .delete()

router.route('/wishlist')
  .get(auth, controller.wishlist)
  .post()
  .put()
  .delete()

router.route('/wishlist/add/:id')
  .get(auth, controller.addWishList)
  .post()
  .put()
  .delete()


router.route('/wishlist/del')
  .get()
  .post(auth, controller.delwishlist)
  .put()
  .delete()

module.exports = router;