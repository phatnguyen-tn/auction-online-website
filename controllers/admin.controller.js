var User = require('../models/User');
var Cat = require('../models/cat.model');
var Product = require('../models/product.model');
var config = require('../config/config');

// render admin page
module.exports.index = function (req, res) {
    res.render('admin/index', { layout: 'admin/layoutadmin' });
}

// render list categories
module.exports.listCat = async function (req, res) {
    var cats = await Cat.find();
    // var countCat = await Cat.countDocuments();
    var countCat = cats.length;
    var page = parseInt(req.query.page) || 1;
    if (page < 1) page = 1;
    var start = (page - 1) * config.PER_PAGE;
    var end = page * config.PER_PAGE;
    var totalPage = Math.ceil(countCat / config.PER_PAGE);
    res.render('admin/listcategories', {
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
    if(temp.name ==="") {
        res.redirect('/admin/listcategories');
        return;
    }
    temp.amount = 0;
    temp.save(function (err, doc) {
        if (!err) {
            res.redirect('/admin/listcategories');
        }
        else {
            console.log("Error during record insertion: " + err);
        }
    });
}

// delete category
module.exports.delCat = async function (req, res) {
    var name = req.body.catName;
    var tmp  = await Cat.findOneAndRemove({ name: name }); 
    res.redirect('/admin/listcategories');
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
    res.render('admin/listproduct', {
        layout: 'admin/layoutadmin',
        products: products.slice(start, end),
        currentPage: page,
        totalPage: totalPage
    });
}

module.exports.listUser = function (req, res) {
    res.render('admin/listuser', { layout: 'admin/layoutadmin' });
}

module.exports.listRequest = function (req, res) {
    res.render('admin/listrequest', { layout: 'admin/layoutadmin' });
}
