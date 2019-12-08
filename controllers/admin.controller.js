var User = require('../models/User');

module.exports.index = function(req, res){
    res.render('admin/index', { layout: 'admin/layoutadmin'});
}

module.exports.listCat = function(req, res){
    res.render('admin/listcategories', { layout: 'admin/layoutadmin'});
}

module.exports.listProduct = function(req, res){
    res.render('admin/listproduct', { layout: 'admin/layoutadmin'});
}

module.exports.listUser = function(req, res){
    res.render('admin/listuser', { layout: 'admin/layoutadmin'});
}

module.exports.listRequest = function(req, res){
    res.render('admin/listrequest', { layout: 'admin/layoutadmin'});
}
