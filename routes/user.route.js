const router = require('express').Router();

//middleware auth
const auth = require('../middleware/auth.middleware');
const validInput = require('../middleware/valid');
const { validationResult } = require('express-validator');

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
    console.log(file.originalname);
    cb(null, 'ahihi.jpg');
  }
})
const uploadAvt = multer({
  storage: storageUpdateProfile
}).single('avatar')

const controller = require('../controllers/user.controller');

// user model
const User = require('../models/User');

router.route('/')
  .get(auth, controller.user)
  .post()
  .put()
  .delete()

router.route('/update')
  .get(auth, controller.updateProfile)
  .post(auth, validInput.validUpdateProfile, async (req, res, next) => {
    const xxx = new FormData(req.body);
    console.log(xxx);
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
      uploadAvt(req, res, err => {
        if (err) {
          req.flash('error', 'Không thể cập nhật ảnh đại diện');
          return res.redirect('back');
        }  
      })
      req.flash('success', 'Thay đổi profile thành công');
      res.redirect('back');
      next();
    } catch (error) {
      console.error(error.message);
    }
  })
  .put()
  .delete()

router.route('/post')
  .get(auth, controller.post)
  .post(upload.array('avatar', 10), controller.postProduct)
  .put()
  .delete()

module.exports = router;