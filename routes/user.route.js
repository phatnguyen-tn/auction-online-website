const router = require('express').Router();

//middleware auth
const auth = require('../middleware/auth.middleware');

//multer
const multer  = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads/' )
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname)
    }
  })
const upload = multer({ storage });

const controller = require('../controllers/user.controller');

router.route('/')
    .get(auth, controller.user)
    .post()
    .put()
    .delete()

router.route('/update')
    .get(auth, controller.updateProfile)
    .post()
    .put()
    .delete()

router.route('/post')
    .get(auth, controller.post)
    .post(upload.array('avatar', 10), controller.postProduct)
    .put()
    .delete()

module.exports = router;