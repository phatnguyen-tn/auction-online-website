const express = require('express');
const router = require('express').Router();
const controller = require('../controllers/admin.controller');

// Dashboard
router.route('/')
    .get(controller.index)
    .post()
    .put()
    .delete()
// Manage categories list
router.route('/listcategories')
    .get(controller.listCat)
    .post(controller.postListCat)
    .put()
    .delete()
// Delete category
router.route('/listcategories/delete')
    .get()
    .post(controller.delCat)
    .put()
    .delete()
// View category
router.route('/listcategories/:id')
    .get(controller.get)
    .post()
    .put()
    .delete()
// Manage product list
router.route('/listproduct')
    .get(controller.listProduct)
    .post()
    .put()
    .delete()
// Manage user list
router.route('/listuser')
    .get(controller.listUser)
    .post()
    .put()
    .delete()
// Manage request list
router.route('/listrequest')
    .get(controller.listRequest)
    .post()
    .put()
    .delete()

module.exports = router;