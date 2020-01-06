const request = require('request');

module.exports = (req, res, next) => {
    if (req.body['g-recaptcha-response']) {

        const secretKey = '6Lftp8wUAAAAACsuMbf-nOG3cSo8dROA_qQnHaHh';
        const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}
        &response=${req.body['g-recaptcha-response']}
        &remoteip=${req.connection.remoteAddress}`;

        request(verificationUrl, (err, response, body) => {
            body = JSON.parse(body);
            if (body.success) {
                next();
            } else {
                req.flash('error', 'Lỗi xác thực captcha');
                res.redirect('back');
            }
        })
    } else {
        req.flash('error', 'Xác thực recaptcha');
        res.redirect('back');
    }
}