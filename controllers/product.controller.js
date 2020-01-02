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

function isExpired(date) {
    var end = moment(date);
    return end.diff(moment());
}

function autoExtend(date) {
    return date.add(5, 'minutes');
}

function searchCat(cats, cat) {
    for (let index = 0; index < cats.length; index++) {
        const element = cats[index];
        if (element.toLowerCase().indexOf(cat.toLowerCase()) !== -1)
            return true;
    }
}

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
function findTopBidder(list){
    return list.reduce(function(element1, element2){
        return element1.price > element2.price ? element1 : element2;
    }, 0);
}

module.exports.listproduct = function (req, res) {
    try {
        // Update products
        Product.find(function (err, doc) {
            doc.forEach(async function (element) {
                if (element.extend === 'yes') {
                    autoExtend(element.expDate);
                }
                if (element.status == 'bidding' && isExpired(element.expDate) <= 0) {
                    element.status = 'done';
                    // Update category
                    await Cat.findOne({ name: element.category[0] }, function (err, doc) {
                        doc.amount--;
                        var value = doc.amountChild[doc.child.indexOf(element.category[1])];
                        value = value - 1;
                        doc.amountChild.set(doc.child.indexOf(element.category[1]), value);
                        doc.save();
                    });
                }
            });
        })
        Product.updateMany({ status: 'done' }, Product);
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
            topBidder: topBidder
        });
    } catch (error) {
        console.log(error);
    }
}

module.exports.historybid = function (req, res) {
    var product = findProductById(res.locals.products, req.params.id);
    product.historyBidId.turn.forEach(function(element){
        element.username = maskInfo(element.username);
    });
    res.render('historybid', {
        product: product
    });
}

module.exports.productdetail = function (req, res) {
    var product = findProductById(res.locals.products, req.params.id);
    res.render('productdetail', {
        product: product
    });
}

module.exports.wishlist = function (req, res) {
    res.render('wishlist');
}