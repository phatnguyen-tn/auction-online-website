const router = require('express').Router();

//middleware auth
const auth = require('../middleware/auth.middleware');

const controller = require('../controllers/user.controller');

router.route('/')
    .get(auth, controller.user)
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
    .post(controller.postProduct)
    .put()
    .delete()

module.exports = router;