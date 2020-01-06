const Cat = require('../models/cat.model');
const Product = require('../models/product.model');

const moment = require('moment');

// Check Expired Product
function isExpired(date) {
    var end = moment(date);
    return end.diff(moment());
}

module.exports = function (app) {
    app.use(async function (req, res, next) {
        const cats = await Cat.find();
        const products = await Product.find().populate('historyBidId');
        res.locals.cats = cats;
        // update product
        products.forEach(function (product) {
            var expDate = product.expDate;
            var temp = Product.findOne({ _id: product._id }, async function (err, doc) {
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
        res.locals.products = products.filter(function (product) {
            return product.status === 'bidding';
        });
        next();
    });
}