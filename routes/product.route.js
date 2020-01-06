const router = require('express').Router();
const controller = require('../controllers/product.controller');

const auth = require('../middleware/auth.middleware');

router.route('/')
    .get(controller.listproduct)
    .post()
    .put()
    .delete()

router.route('/bidhistory/:id')
    .get(controller.historybid)
    .post()
    .put()
    .delete()

router.route('/block/:username')
    .get(auth, controller.blockbid)
    .post()
    .put()
    .delete()

router.route('/bid/:id')
    .get(auth, controller.bid)
    .post()
    .put()
    .delete()

router.route('/:id')
    .get(controller.productdetail)
    .post()
    .put()
    .delete()

module.exports = router;