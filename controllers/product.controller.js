const config = require('../config/config');
const moment = require('moment');

const Historybid = require('../models/historybid.model');
const Product = require('../models/product.model');
const Cat = require('../models/cat.model');

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
        var products = res.locals.products;
        products.forEach(function (product) {
            var expDate = product.expDate;
            var temp = Product.findOne({ _id: product._id },async function (err, doc) {
                // if (doc.extend === 'yes') {
                //     doc.expDate = autoExtend(expDate);
                // }
                if (doc.status == 'bidding' && isExpired(expDate) <= 0) {
                    doc.status = 'done';
                    // Update category
                    await Cat.findOne({ name: doc.category[0] }, function (err, doc1) {
                        doc1.amount--;
                        var value = doc1.amountChild[doc1.child.indexOf(doc.category[1])];
                        value = value - 1;
                        doc1.amountChild.set(doc1.child.indexOf(doc.category[1]), value);
                        doc1.save();
                    });
                    doc.save();
                }
            });
        });
        // Filter products
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
            return product.status === 'bidding';
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
        })
        topBidder.forEach(function (element) {
            element.username = maskInfo(element.username);
        })
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
    product.historyBidId.turn.forEach(function (element) {
        element.username = maskInfo(element.username);
    });
    res.render('historybid', {
        user: req.user,
        product: product
    });
}

module.exports.productdetail = function (req, res) {
    var product = findProductById(res.locals.products, req.params.id);
    res.render('productdetail', {
        user: req.user,
        product: product
    });
}

module.exports.addWishList = function (req, res) {
    User.findById(req.user.id, function (err, doc) {
        doc.wishlist.push(req.body.idProduct);
        doc.save();
    });
}