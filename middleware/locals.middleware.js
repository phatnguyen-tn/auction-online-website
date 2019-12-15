const Cat = require('../models/cat.model');

module.exports = function(app){
    app.use(async function(req, res, next){
        const cats = await Cat.find();
        const products = await products.find();
        res.locals.cats = cats;
        res.locals.products = products;
        next();
    });
}