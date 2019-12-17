var User = require('../models/User');
var Cat = require('../models/cat.model');
var Product = require('../models/product.model');
var config = require('../config/config');

// render admin page
module.exports.index = async function (req, res) {
    var products = await Product.countDocuments();
    var users = await User.countDocuments();
    res.render('admin/index', {
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
        res.redirect('admin/categories');
        return;
    }
    temp.amount = 0;
    temp.save(function (err, doc) {
        if (!err) {
            res.redirect('admin/categories');
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
    res.redirect('admin/categories');
}

// edit category
module.exports.editCat = async function (req, res) {
    var id = req.params.id;
    var cat = await Cat.findById({ _id: id });
    res.render('admin/editCat', {
        layout: 'admin/layoutadmin',
        cat: cat
    })
}

module.exports.posteditCat = function (req, res) {
    var id = req.params.id;
    Cat.findById({ _id: id }, function (err, doc) {
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
    var cat = await Cat.findById({ _id: id });
    var products = await Product.find({ type: cat.name });
    var countProduct = products.length;
    var page = parseInt(req.query.page) || 1;
    if (page < 1) page = 1;
    var start = (page - 1) * config.PER_PAGE;
    var end = page * config.PER_PAGE;
    var totalPage = Math.ceil(countProduct / config.PER_PAGE);
    res.render('admin/viewCat', {
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
        layout: 'admin/layoutadmin',
        products: products.slice(start, end),
        currentPage: page,
        totalPage: totalPage
    });
}

module.exports.getProduct = async function (req, res) {
    var id = req.params.id;
    var product = await Product.findById({ _id: id });
    res.render('admin/viewProduct', {
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
        layout: 'admin/layoutadmin',
        users: users.slice(start, end), 
        currentPage: page,
        totalPage: totalPage
    });
}

module.exports.addUser = function(req, res){
    res.render('admin/adduser', {
        layout: 'admin/layoutadmin'
    })
}

module.exports.postAddUser = function(req, res){
    var temp = new User();
    temp.username = req.body.username;
    temp.password = req.body.password;
    temp.save();
}

module.exports.listRequest = async function (req, res) {
    var users = await User.find({request: true});
    var countUsers = users.length;
    var page = parseInt(req.query.page) || 1;
    if (page < 1) page = 1;
    var start = (page - 1) * config.PER_PAGE;
    var end = page * config.PER_PAGE;
    var totalPage = Math.ceil(countUsers / config.PER_PAGE);
    res.render('admin/requests', { 
        layout: 'admin/layoutadmin',
        users: users.slice(start, end), 
        currentPage: page,
        totalPage: totalPage
    });
}
