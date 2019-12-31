const moment = require('moment');
const config = require('../config/config');

module.exports.listproduct = function(req, res){
    var q = req.query.q;
    // var products = res.locals.products.filter(function(product){
    //     return q.toLowerCase() == product.toLowerCase();
    // });
    var products = res.locals.products;
    var countProduct = products.length;
    var page = parseInt(req.query.page) || 1;
    if (page < 1) page = 1;
    var start = (page - 1) * config.PER_PAGE;
    var end = page * config.PER_PAGE;
    var totalPage = Math.ceil(countProduct / config.PER_PAGE);
    res.render('listproduct', {
        products: products.slice(start, end),
        currentPage: page,
        totalPage: totalPage
    });
}

module.exports.productdetail = function(req, res){
    res.render('productdetail');
}

module.exports.wishlist = function (req, res) {  
    res.render('wishlist');
}