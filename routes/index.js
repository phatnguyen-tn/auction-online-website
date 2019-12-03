const router = require('express').Router();

router.route('/')
    .get((req, res) => {
        res.render('index');
    })
    .post()
    .put()
    .delete()

router.route('/login')
    .get((req, res) => {
        res.render('login')
    })
    .post()
    .put()
    .delete()

module.exports = router;