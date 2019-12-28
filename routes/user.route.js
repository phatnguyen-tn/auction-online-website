const router = require('express').Router();

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
    .post(controller.postProduct)
    .put()
    .delete()

module.exports = router;