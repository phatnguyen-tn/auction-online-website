const Cat = require('../models/cat.model');
const Product = require('../models/product.model');
const User = require('../models/User');

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

module.exports.postProduct = function (req, res) {
    var tmp = new Product();
    tmp.name = req.body.name;
    res.redirect('/user');
}