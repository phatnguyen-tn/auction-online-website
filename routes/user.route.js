const router = require('express').Router();

const multer  = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads/' )
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })

const upload = multer({ storage });

const controller = require('../controllers/user.controller');

router.route('/')
    .get(controller.user)
    .post()
    .put()
    .delete()

router.route('/update')
    .get(controller.updateProfile)
    .post()
    .put()
    .delete()

router.route('/post')
    .get(controller.post)
    .post(upload.array('avatar', 10), controller.postProduct)
    .put()
    .delete()

module.exports = router;