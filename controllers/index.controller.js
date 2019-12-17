module.exports.listproduct = function(req, res){
    res.render('listproduct');
}

module.exports.productdetail = function(req, res){
    res.render('productdetail');
}

module.exports.user = function(req, res){
    res.render('profile');
}

module.exports.updateProfile = function(req, res){
    res.render('updateProfile');
}

module.exports.post = function(req, res){
    res.render('postproduct');
}

module.exports.postProduct = function(req, res){
    res.redirect('/user');
}