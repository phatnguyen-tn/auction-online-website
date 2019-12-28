const Product = require('../models/product.model');

module.exports.user = function(req, res){
    res.render('profile');
}

module.exports.updateProfile = function(req, res){
    res.render('updateProfile');
}

module.exports.post = function(req, res){
    var tmp = new Product();
    tmp.name = req.body.name;
    tmp.category = 
    res.render('postproduct');
}

module.exports.postProduct = function(req, res){
    res.redirect('/user');
}