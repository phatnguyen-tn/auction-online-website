const Cat = require('../models/cat.model');
const Product = require('../models/product.model');
const User = require('../models/User');

module.exports.user = async function (req, res) {
    try {
        const user = await User.findById(req.user.id).populate('profileId');
        if (user) {
            console.log(user);
            res.render('profile', {
                user: req.user,
                profile: user.profileId
            });
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

<<<<<<< HEAD
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
=======
module.exports.postProduct = function (req, res) {
    var tmp = new Product();
    tmp.name = req.body.name;
    res.redirect('/user');
>>>>>>> 3dc05596765956eb4db66f7bdaba118960e86536
}