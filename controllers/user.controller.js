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
        wishlist.forEach(function (element) {
            var temp1 = moment(element.sellDate);
            element.sellDate = temp1.fromNow();
            var temp2 = moment(element.expDate);
            element.expDate = temp2.fromNow();
        });
        var biddingProduct = products.filter(function (product) {
            for (let index = 0; index < product.historyBidId.turn.length; index++) {
                const element = product.historyBidId.turn[index];
                if (element.username === req.user.authId)
                return true;
            }
        });
        var sellDateBP = [];
        var expDateBP = [];
        biddingProduct.forEach(function(product){
            var temp1 = moment(product.sellDate);
            sellDateBP.push(temp1.fromNow());
            var temp2 = moment(product.expDate);
            expDateBP.push(temp2.fromNow());
        });
        var winProduct = products.filter(function (product) {
            return (product.topBidder === req.user.authId && product.status === 'done');
        });
        var sellDateWP = [];
        var expDateWP = [];
        winProduct.forEach(function(product){
            var temp1 = moment(product.sellDate);
            sellDateWP.push(temp1.fromNow());
            var temp2 = moment(product.expDate);
            expDateWP.push(temp2.fromNow());
        });
        if (user) {
            res.render('profile', {
                user: user,
                wishlist: wishlist,
                sellDate: sellDate,
                expDate: expDate,
                sellDateBP: sellDateBP,
                expDateBP: expDateBP,
                sellDateWP: sellDateWP,
                expDateWP: expDateWP,
                biddingProduct: biddingProduct,
                winProduct: winProduct
            });
        }
    } catch (error) {
        console.error(error.message);
    }
}

module.exports.updateProfile = function (req, res) {
    res.render('updateProfile', { user: req.user });
}

module.exports.post = async function (req, res) {
    try {
        var cats = await Cat.find();
        res.render('postproduct', {
            cats: cats,
            user: req.user
        });
    } catch (error) {
        console.log(error);
    }
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
        tmp.seller = req.user.authId;
        tmp.sellDate = moment();
        tmp.expDate = moment().add(5, 'days');
        tmp.images = req.body.avatar;
        tmp.description = req.body.description;
        tmp.currentPrice = req.body.startingPrice;
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

module.exports.upgradeRole = async function (req, res) {
    try {
        if (req.user.type === 'seller') res.redirect('/user');
        await User.findOne({ authId: req.user.authId }, function (err, doc) {
            doc.isRequest = true;
            doc.save();
        });
        res.redirect('/user');
    } catch (error) {
        console.log(error);
    }
}

module.exports.wishlist = function (req, res) {
    try {
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
    } catch (error) {
        console.log(error);
    }
}

module.exports.addWishList = function (req, res) {
    try {
        var id = req.params.id;
        User.findById(req.user.id, function (err, doc) {
            if (doc.wishlist.indexOf(id) === -1) {
                doc.wishlist.push(id);
                doc.save();
            }
        });
        res.redirect('/products');
    } catch (error) {
        console.log(error);
    }
}

module.exports.delwishlist = async function (req, res) {
    try {
        var id = req.body.id;
        var index = req.user.wishlist.indexOf(id);
        var newWishList = req.user.wishlist;
        newWishList.splice(index, 1);
        const result = await User.findByIdAndUpdate(req.user.id, {
            $set: { wishlist: newWishList }
        });
        res.redirect('/user/wishlist');
    } catch (error) {
        console.log(error);
    }
}
