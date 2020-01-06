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

router.route('/block')
    .get()
    .post(auth, controller.blockbid)
    .put()
    .delete()

router.route('/edit/:id')
    .get(auth, controller.edit)
    .post(auth, controller.postEdit)
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