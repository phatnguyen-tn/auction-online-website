const Cat = require('../models/cat.model');
const Product = require('../models/product.model');
const Historybid = require('../models/historybid.model');
const User = require('../models/User');
const moment = require('moment');

moment.updateLocale('en', {
    relativeTime: Object
});

moment.updateLocale('en', {
    relativeTime: {
        future: "Trong %s",
        past: "%s trước",
        s: 'một vài giây',
        ss: '%d giây',
        m: "một phút",
        mm: "%d phút",
        h: "một giờ",
        hh: "%d giờ",
        d: "một ngày",
        dd: "%d ngày",
        M: "một tháng",
        MM: "%d tháng",
        y: "một năm",
        yy: "%d năm"
    }
});

module.exports.user = async function (req, res) {
    try {
        const user = await User.findById(req.user.id);
        if (user) {
            res.render('profile', { user: user });
        }
    } catch (error) {
        console.error(error.message);
    }
}

module.exports.updateProfile = function (req, res) {
    res.render('updateProfile', { user: req.user });
}

module.exports.post = async function (req, res) {
    var cats = await Cat.find();
    res.render('postproduct', {
        cats: cats,
        user: req.user
    });
}

module.exports.postProduct = async function (req, res) {
    try {
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
        tmp.sellDate = moment();
        tmp.expDate = moment().add(5, 'days');
        tmp.images = req.body.avatar;
        tmp.discription = req.body.discription;
        tmp.currentPrice = req.body.currentPrice;
        tmp.stepPrice = req.body.stepPrice;
        tmp.bestPrice = req.body.bestPrice;
        tmp.extend = req.body.extend;
        tmp.status = 'bidding';
        var historybid = new Historybid();
        historybid.save();
        tmp.historyBidId = historybid.id;
        tmp.save();
        res.redirect('/user');
    } catch (error) {
        console.log(error);
    }
}

function findProductById(products, id) {
    for (let index = 0; index < products.length; index++) {
        const element = products[index];
        if (element.id === id) {
            return element;
        }
    };
}

module.exports.wishlist = function (req, res) {
    var wishlist = [];
    var wishlists = req.user.wishlist;
    var products = res.locals.products;
    var sellDate = [];
    var expDate = [];
    wishlists.forEach(function (element) {
        var temp = findProductById(products, element);
        var temp1 = moment(temp.sellDate);
        sellDate.push(temp1.fromNow());
        var temp2 = moment(temp.expDate);
        expDate.push(temp2.fromNow());
        wishlist.push(temp);
    });
    res.render('wishlist', {
        user: req.user,
        wishlist: wishlist,
        sellDate: sellDate,
        expDate: expDate
    });
}

module.exports.delwishlist = async function(req, res){
    var id = req.body.id;
    var index = req.user.wishlist.indexOf(id);
    var newWishList = req.user.wishlist;
    newWishList.splice(index, 1);
    const result = await User.findByIdAndUpdate(req.user.id, {
        $set: {wishlist: newWishList}
    });
    res.redirect('/user/wishlist');
}
