const Cat = require('./cat.model');
const cats = Cat.find(); 

const pagination = {
    current_page = 1,
    total_record = 1,
    total_page = 1,
    limit = 1,
    start = 1,
    link_full = '',
    link_first = ''
};

function pagination(current_page) {
    // this.current_page = current_page;
    // this.total_page = Cat.length;
    // var page = parseInt(req.query.page) || 1; // n
    var perPage = 8 // x
    var start = (page - 1) * perPage;
    var end = page * perPage;

    var currentPage = page;
    var nextPage = page + 1;
    var previousPage = page - 1; 

    var maxProduct = 100;
    var maxPage = Math.ceil(maxProduct / perPage);
}

module.exports = pagination;