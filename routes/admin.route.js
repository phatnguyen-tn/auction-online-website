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
router.route('/categories')
    .get(controller.listCat)
    .post(controller.postListCat)
    .put()
    .delete()
// Delete category
router.route('/categories/delete')
    .get()
    .post(controller.delCat)
    .put()
    .delete()
// View category
router.route('/categories/:id')
    .get(controller.get)
    .post()
    .put()
    .delete()
// Edit category
router.route('/categories/edit/:id')
    .get(controller.editCat)
    .post(controller.posteditCat)
    .put()
    .delete()
// Manage product list
router.route('/products')
    .get(controller.listProduct)
    .post()
    .put()
    .delete()
router.route('/products/:id')
    .get(controller.getProduct)
    .post()
    .put()
    .delete()

// Manage user list
router.route('/users')
    .get(controller.listUser)
    .post()
    .put()
    .delete()
router.route('/users/add')
    .get(controller.addUser)
    .post(controller.postAddUser)
    .put()
    .delete()

// Manage request list
router.route('/requests')
    .get(controller.listRequest)
    .post()
    .put()
    .delete()

module.exports = router;