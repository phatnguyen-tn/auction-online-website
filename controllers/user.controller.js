const Cat = require('../models/cat.model');
const Product = require('../models/product.model');

module.exports.user = function(req, res){
    res.render('profile');
}

module.exports.updateProfile = function(req, res){
    res.render('updateProfile');
}

module.exports.post = async function(req, res){
    var cats = await Cat.find();
    res.render('postproduct', {
        cats: cats
    });
}

module.exports.postProduct =  function(req, res){
    // var tmp = new Product();
    // tmp.name = req.body.name;
    // tmp.category = req.body.cat;
    // res.redirect('/user');
    var tmp = req.body;
    req.body.avatar = [];
    req.files.forEach(function(file){
        req.body.avatar.push(file.path.split('\\').slice(1).join('/'));
    });
    // req.body.avatar = req.files.path.split('\\').slice(1).join('/');
    res.send(req.body);
}