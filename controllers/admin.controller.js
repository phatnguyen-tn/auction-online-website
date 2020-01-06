var User = require('../models/User');
var Cat = require('../models/cat.model');
var Product = require('../models/product.model');
var config = require('../config/config');

// render admin page
module.exports.index = async function (req, res) {
    var products = await Product.countDocuments();
    var users = await User.countDocuments();
    res.render('admin/index', {
        user: req.user,
        layout: 'admin/layoutadmin',
        users: users,
        products: products
    });
}

// render list categories
module.exports.listCat = async function (req, res) {
    var cats = await Cat.find();
    var countCat = cats.length;
    var page = parseInt(req.query.page) || 1;
    if (page < 1) page = 1;
    var start = (page - 1) * config.PER_PAGE;
    var end = page * config.PER_PAGE;
    var totalPage = Math.ceil(countCat / config.PER_PAGE);
    res.render('admin/categories', {
        user: req.user,
        layout: 'admin/layoutadmin',
        cats: cats.slice(start, end),
        currentPage: page,
        totalPage: totalPage
    });
}

// add new categories
module.exports.postListCat = function (req, res) {
    var newCat = req.body.newCat;
    var temp = new Cat();
    temp.name = newCat.trim();
    if (temp.name === "") {
        res.redirect('/admin/categories');
        return;
    }
    temp.amount = 0;
    temp.save(function (err, doc) {
        if (!err) {
            res.redirect('/admin/categories');
        }
        else {
            console.log("Error during record insertion: " + err);
        }
    });
}

// delete category
module.exports.delCat = async function (req, res) {
    var name = req.body.catName;
    var tmp = await Cat.findOneAndRemove({ name: name });
    res.redirect('/admin/categories');
}

// edit category
module.exports.editCat = async function (req, res) {
    var id = req.params.id;
    var cat = await Cat.findById(id);
    res.render('admin/editCat', {
        user: req.user,
        layout: 'admin/layoutadmin',
        cat: cat
    })
}

module.exports.posteditCat = function (req, res) {
    var id = req.params.id;
    Cat.findById(id, function (err, doc) {
        if (!err) {
            doc.name = req.body.catName;
            doc.save();
            res.redirect(`/admin/categories/${id}`);
        }
        else {
            console.log("Error: " + err);
        }
    });
}

// view category
module.exports.get = async function (req, res) {
    var id = req.params.id;
    var cat = await Cat.findById(id);
    var products = res.locals.products;
    products = products.filter(function(product){
        return product.category[0] === cat.name;
    });
    var countProduct = products.length;
    var page = parseInt(req.query.page) || 1;
    if (page < 1) page = 1;
    var start = (page - 1) * config.PER_PAGE;
    var end = page * config.PER_PAGE;
    var totalPage = Math.ceil(countProduct / config.PER_PAGE);
    res.render('admin/viewCat', {
        user: req.user,
        layout: 'admin/layoutadmin',
        cat: cat,
        products: products.slice(start, end),
        currentPage: page,
        totalPage: totalPage
    });
}

module.exports.listProduct = async function (req, res) {
    var products = await Product.find();
    var countProduct = products.length;
    var page = parseInt(req.query.page) || 1;
    if (page < 1) page = 1;
    var start = (page - 1) * config.PER_PAGE;
    var end = page * config.PER_PAGE;
    var totalPage = Math.ceil(countProduct / config.PER_PAGE);
    res.render('admin/products', {
        user: req.user,
        layout: 'admin/layoutadmin',
        products: products.slice(start, end),
        currentPage: page,
        totalPage: totalPage
    });
}

module.exports.getProduct = async function (req, res) {
    var id = req.params.id;
    var product = await Product.findById(id);
    res.render('admin/viewProduct', {
        user: req.user,
        layout: 'admin/layoutadmin',
        product: product
    })
}

module.exports.listUser = async function (req, res) {
    var users = await User.find();
    var countUsers = users.length;
    var page = parseInt(req.query.page) || 1;
    if (page < 1) page = 1;
    var start = (page - 1) * config.PER_PAGE;
    var end = page * config.PER_PAGE;
    var totalPage = Math.ceil(countUsers / config.PER_PAGE);
    res.render('admin/users', {
        user: req.user,
        layout: 'admin/layoutadmin',
        users: users.slice(start, end),
        currentPage: page,
        totalPage: totalPage
    });
}

module.exports.listRequest = async function (req, res) {
    var users = await User.find({ isRequest: true });
    var countUsers = users.length;
    var page = parseInt(req.query.page) || 1;
    if (page < 1) page = 1;
    var start = (page - 1) * config.PER_PAGE;
    var end = page * config.PER_PAGE;
    var totalPage = Math.ceil(countUsers / config.PER_PAGE);
    res.render('admin/requests', {
        user: req.user,
        layout: 'admin/layoutadmin',
        users: users.slice(start, end),
        currentPage: page,
        totalPage: totalPage
    });
}

module.exports.getUser = async function (req, res) {
    var user1 = await User.findById(req.params.id);
    res.render('admin/viewuser', {
        user: req.user,
        layout: 'admin/layoutadmin',
        user1: user1
    });
}

module.exports.desRole = async function(req, res){
    await User.findById(req.params.id, function(err, doc){
        doc.type = 'bidder';
        doc.save();
    });
    res.redirect('/admin/users');
}

module.exports.acceptRequest = async function(req, res){
    await User.findById(req.params.id, function(err, doc){
        doc.isRequest = false;
        doc.type = 'seller';
        doc.save();
    });
    res.redirect('/admin/users');
}

module.exports.refuseRequest = async function(req, res){
    await User.findById(req.params.id, function(err, doc){
        doc.isRequest = false;
        doc.save();
    });
    res.redirect('/admin/users');
}