const express = require('express');
const router = require('express').Router();
const controller = require('../controllers/admin.controller');

const authAD = require('../middleware/authAD.middleware');

// Dashboard
router.route('/')
    .get(authAD, controller.index)
    .post()
    .put()
    .delete()
// Manage categories list
router.route('/categories')
    .get(authAD, controller.listCat)
    .post(authAD, controller.postListCat)
    .put()
    .delete()
// Delete category
router.route('/categories/delete')
    .get()
    .post(authAD, controller.delCat)
    .put()
    .delete()
// View category
router.route('/categories/:id')
    .get(authAD, controller.get)
    .post()
    .put()
    .delete()
// Edit category
router.route('/categories/edit/:id')
    .get(authAD, controller.editCat)
    .post(authAD, controller.posteditCat)
    .put()
    .delete()

router.route('/categories/addchild/:id')
    .get()
    .post(authAD, controller.addChild)
    .put()
    .delete()

// Manage product list
router.route('/products')
    .get(authAD, controller.listProduct)
    .post()
    .put()
    .delete()
router.route('/products/:id')
    .get(authAD, controller.getProduct)
    .post()
    .put()
    .delete()

// Manage user list
router.route('/users')
    .get(authAD, controller.listUser)
    .post()
    .put()
    .delete()

router.route('/users/des/:id')
    .get(authAD, controller.desRole)
    .post()
    .put()
    .delete()

router.route('/users/:id')
    .get(authAD, controller.getUser)
    .post()
    .put()
    .delete()

// Manage request list
router.route('/requests')
    .get(authAD, controller.listRequest)
    .post()
    .put()
    .delete()

router.route('/requests/accept/:id')
    .get(authAD, controller.acceptRequest)
    .post()
    .put()
    .delete()

router.route('/requests/refuse/:id')
    .get(authAD, controller.refuseRequest)
    .post()
    .put()
    .delete()

module.exports = router;