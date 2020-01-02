const Cat = require('../models/cat.model');
const Product = require('../models/product.model');

module.exports = function(app){
    app.use(async function(req, res, next){
        const cats = await Cat.find();
        const products = await Product.find().populate('historyBidId');
        res.locals.cats = cats;
        res.locals.products = products;
        next();
    });
}