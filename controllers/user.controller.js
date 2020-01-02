const Cat = require('../models/cat.model');
const Product = require('../models/product.model');
const User = require('../models/User');
const moment = require('moment');

module.exports.user = async function (req, res) {
    try {
        const user = await User.findById(req.user.id).populate('profileId');
        if (user) {
            res.render('profile', { user: user });
        }
    } catch (error) {
        console.error(error.message);
    }
}

module.exports.updateProfile = function (req, res) {
    res.render('updateProfile');
}

module.exports.post = async function (req, res) {
    var cats = await Cat.find();
    res.render('postproduct', {
        cats: cats
    });
}

module.exports.postProduct = async function (req, res) {
    req.body.avatar = [];
    req.files.forEach(function (file) {
        req.body.avatar.push(file.path.split('\\').slice(1).join('/'));
    });
    var tmp = new Product();
    tmp.name = req.body.name;
    tmp.category = [req.body.selectCatChild, req.body.selectCat];
    await Cat.findOne({ name: req.body.selectCatChild }, function (err, doc) {
        doc.amount++;
        var value = doc.amountChild[doc.child.indexOf(req.body.selectCat)];
        value = value + 1;
        doc.amountChild.set(doc.child.indexOf(req.body.selectCat), value);
        doc.save();
    });
    tmp.seller = req.user.username;
    tmp.sellDate = moment().format('MMMM Do YYYY, h:mm:ss a');
    tmp.images = req.body.avatar;
    tmp.discription = req.body.discription;
    tmp.currentPrice = req.body.currentPrice;
    tmp.stepPrice = req.body.stepPrice;
    tmp.bestPrice = req.body.bestPrice;
    tmp.extend = req.body.extend;
    tmp.status = 'bidding';
    tmp.save();
    res.redirect('/user');
}