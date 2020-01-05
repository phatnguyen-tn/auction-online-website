const router = require('express').Router();
const controller = require('../controllers/product.controller');

router.route('/')
    .get(controller.listproduct)
    .post()
    .put()
    .delete()

router.route('/search')
    .get()
    .post()
    .put()
    .delete()

router.route('/bidhistory/:id')
    .get(controller.historybid)
    .post()
    .put()
    .delete()

router.route('/:id')
    .get(controller.productdetail)
    .post()
    .put()
    .delete()

module.exports = router;