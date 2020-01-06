const config = require('../config/config');
const moment = require('moment');

const Historybid = require('../models/historybid.model');
const Product = require('../models/product.model');
const Cat = require('../models/cat.model');
const User = require('../models/User');

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

// Maske Infomation
function maskInfo(value) {
    var maskedValue = value;
    if (value && value.length > 5) {
        maskedValue =
            "***" + maskedValue.substring(value.length - 4, value.length);
    } else {
        maskedValue = "****";
    }
    return maskedValue;
}

// Check Expired Product
function isExpired(date) {
    var end = moment(date);
    return end.diff(moment());
}

// Auto Extend Expired Date
function autoExtend(date) {
    return date.add(10, 'minutes');
}

// Search Category in Array Cats
function searchCat(cats, cat) {
    for (let index = 0; index < cats.length; index++) {
        const element = cats[index];
        if (element.toLowerCase().indexOf(cat.toLowerCase()) !== -1)
            return true;
    }
}

// Find Product By ID
function findProductById(products, id) {
    for (let index = 0; index < products.length; index++) {
        const element = products[index];
        if (element.id === id) return element;
    }
}

// Filter product (sort)
function filterProduct(array, condition) {
    switch (condition) {
        case 1:
            return (array.sort(function (element1, element2) {
                var date1 = moment(element1.sellDate);
                var date2 = moment(element2.sellDate);
                return date1.diff(date2);
            }));
            break;
        case 2:
            return (array.sort(function (element1, element2) {
                var date1 = moment(element1.sellDate);
                var date2 = moment(element2.sellDate);
                return date2.diff(date1);
            }));
            break;
        case 3:
            return (array.sort(function (element1, element2) {
                var turn1 = element1.currentPrice;
                var turn2 = element2.currentPrice;
                return turn1 - turn2;
            }));
            break;
        case 4:
            return (array.sort(function (element1, element2) {
                var turn1 = element1.currentPrice;
                var turn2 = element2.currentPrice;
                return turn2 - turn1;
            }));
            break;
        default:
            break;
    }
}

// find top bidder
function findTopBidder(list) {
    return list.reduce(function (element1, element2) {
        return element1.price > element2.price ? element1 : element2;
    }, 0);
}

module.exports.listproduct = function (req, res) {
    try {
        // Update products
        // var products = res.locals.products;
        // products.forEach(function (product) {
        //     var expDate = product.expDate;
        //     var temp = Product.findOne({ _id: product._id }, async function (err, doc) {
        //         // if (doc.extend === 'yes') {
        //         //     doc.expDate = autoExtend(expDate);
        //         // }
        //         if (doc.status == 'bidding' && isExpired(expDate) <= 0) {
        //             doc.status = 'done';
        //             // Update category
        //             await Cat.findOne({ name: doc.category[0] }, function (err, doc1) {
        //                 doc1.amount--;
        //                 var value = doc1.amountChild[doc1.child.indexOf(doc.category[1])];
        //                 value = value - 1;
        //                 doc1.amountChild.set(doc1.child.indexOf(doc.category[1]), value);
        //                 doc1.save();
        //             });
        //             doc.save();
        //         }
        //     });
        // });
        // Filter products
        var products = res.locals.products;
        if (req.query.sort) {
            products = filterProduct(products, parseInt(req.query.sort));
        }
        // Search by name
        var nameSearch = req.query.name;
        if (nameSearch) {
            products = products.filter(function (product) {
                return product.name.toLowerCase().indexOf(nameSearch.toLowerCase()) !== -1;
            });
        }
        // Search by category
        var catSearch = req.query.cat;
        if (catSearch) {
            products = products.filter(function (product) {
                return searchCat(product.category, catSearch);
            });
        }
        // Filter bidding product
        products = products.filter(function (product) {
            return (product.status === 'bidding');
        });
        var topBidder = [];
        var sellDate = [];
        var dateExp = [];
        products.forEach(function (product) {
            var temp = moment(product.sellDate);
            sellDate.push(temp.fromNow());
            var temp1 = moment(product.expDate);
            dateExp.push(temp1.fromNow());
            topBidder.push(findTopBidder(product.historyBidId.turn));
        });
        topBidder.forEach(function (element) {
            element.username = maskInfo(element.username);
        });
        var countProduct = products.length;
        var page = parseInt(req.query.page) || 1;
        if (page < 1) page = 1;
        var start = (page - 1) * config.PER_PAGE;
        var end = page * config.PER_PAGE;
        var totalPage = Math.ceil(countProduct / config.PER_PAGE);
        res.render('listproduct', {
            products: products.slice(start, end),
            sellDate: sellDate,
            dateExp: dateExp,
            currentPage: page,
            totalPage: totalPage,
            topBidder: topBidder,
            user: req.user
        });
    } catch (error) {
        console.log(error);
    }
}

module.exports.historybid = function (req, res) {
    var product = findProductById(res.locals.products, req.params.id);
    var username = [];
    product.historyBidId.turn.forEach(function (element) {
        username.push(element.username);
        element.username = maskInfo(element.username);
    });
    res.render('historybid', {
        user: req.user,
        product: product,
        username: username
    });
}

function findProductByCat(products, cat, id) {
    return products.filter(function (product) {
        return (product.category[1] === cat && product.id !== id);
    });
}

module.exports.productdetail = function (req, res) {
    var products = res.locals.products;
    var id = req.params.id;
    var product = findProductById(products, id);
    var productByCat = [];
    productByCat = findProductByCat(products, product.category[1], id);
    productByCat.slice(0, 5);
    seller = maskInfo(product.seller);
    topBidder = maskInfo(product.topBidder)
    var temp = moment(product.sellDate);
    var sellDate = temp.fromNow();
    var temp1 = moment(product.expDate);
    var expDate = temp1.fromNow();
    res.render('productdetail', {
        user: req.user,
        product: product,
        sellDate: sellDate,
        expDate: expDate,
        relatedProduct: productByCat,
        seller: seller,
        topBidder: topBidder
    });
}

function checkBidded(list, username) {
    for (let index = 0; index < list.length; index++) {
        const element = list[index];
        if (element.username === username) {
            return { flag: true, index: index };
        }
    }
    return { flag: false, index: -1 };
}

module.exports.bid = async function (req, res) {
    var price = req.query.bidPrice;
    var id = req.params.id;
    var url = "/products/" + id;
    await Product.findById(id, async function (err, doc) {
        var temp = {};
        temp.username = req.user.authId;
        temp.price = price;
        temp.bidDate = moment().format("dddd, MMMM Do YYYY, h:mm:ss a");
        doc.topBidder = temp.username;
        doc.currentPrice = parseInt(temp.price);
        if (price === doc.bestPrice && doc.bestPrice !== 0) {
            doc.status = "done";
            doc.save();
            res.redirect(url);
        }
        await Historybid.findById(doc.historyBidId, function (err, element) {
            var list = element.turn;
            var check = checkBidded(list, temp.username);
            if (check.flag) {
                element.turn.set(check.index, temp);
            }
            else {
                element.turn.push(temp);
            }
            element.save();
        });
        doc.save();
    });
    res.redirect(url);
}

module.exports.blockbid = async function (req, res) {
    var username = req.body.username;
    var id = req.body.id;
    await Product.findById(id, async function (err, doc) {
        if (req.user.authId !== doc.seller) {
            res.redirect('/products/bidhistory/' + id);
        }
        var block = doc.block;
        block.push(username)
        doc.block = block;
        await Historybid.findById(doc.historyBidId, function (err, element) {
            var list = element.turn;
            var temp = username;
            var check = checkBidded(list, temp);
            if (check.flag) {
                var newList = list.splice(check.index, 1);
                element.turn = list;
            }
            if (list.length) {
                doc.currentPrice = list[list.length - 1].price;
                doc.topBidder = list[list.length - 1].username;
            }
            else {
                doc.topBidder = "";
            }
            element.save();
        });
        doc.save();
    });
    res.redirect('/products/bidhistory/' + id);
}

module.exports.edit = function (req, res) {
    var id = req.params.id;
    var product = res.locals.products;
    product = product.filter(function (product) {
        return (product.id === id);
    });
    if (req.user.authId !== product.seller) {
        res.redirect('/user');
    }
    res.render('editproduct', {
        user: req.user,
        product: product
    });
}

module.exports.postEdit = async function (req, res) {
    var text = req.body.description;
    var id = req.body.id;
    var time = moment().format("dddd, MMMM Do YYYY, h:mm:ss a");
    text = '<br><h4><i class="fa fa-edit">' + time + "</i><br><br></h4>" + text;
    await Product.findById(id, function (err, doc) {
        doc.description += text;
        doc.save();
    });
    res.redirect('/user');
}