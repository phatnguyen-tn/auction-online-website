var User = require('../models/User');
var Cat = require('../models/cat.model');

module.exports.index = function (req, res) {
    res.render('admin/index', { layout: 'admin/layoutadmin' });
}

module.exports.listCat = async function (req, res) {
    var cats = await Cat.find();
    var countCat = await Cat.countDocuments();
    res.render('admin/listcategories', { 
        layout: 'admin/layoutadmin',
        cats: cats 
    });
}

module.exports.listProduct = function (req, res) {
    res.render('admin/listproduct', { layout: 'admin/layoutadmin' });
}

module.exports.listUser = function (req, res) {
    res.render('admin/listuser', { layout: 'admin/layoutadmin' });
}

module.exports.listRequest = function (req, res) {
    res.render('admin/listrequest', { layout: 'admin/layoutadmin' });
}
