const { check } = require('express-validator');

module.exports = {
    validRegister: [
        check('username')
            .isLength({ max: 20 })
            .withMessage('tên nguời dùng nhiều nhất 20 ký tự'),
        check('password')
            .not()
            .isEmpty()
            .withMessage('mật khẩu bắt buộc')
            .isLength({ min: 5 })
            .withMessage('mật khẩu ít nhất 5 ký tự')
            .matches(/\d/)
            .withMessage('mật khẩu phải chứa 1 chữ số')
            .not()
            .isIn(['12345', '123456', 'password'])
            .withMessage('mật khẩu không được đơn giản, vd: 12345, 123456, ...'),
        check('name')
            .not()
            .isEmpty()
            .withMessage('Họ tên bắt buộc')
            .trim()
            .isLength({ max: 60 })
            .withMessage('Tên nhiều nhất 60 ký tự')
            .isLength({ min: 5 })
            .withMessage('Họ tên ít nhất 5 ký tự'),
        check('email')
            .isEmail()
            .normalizeEmail()
            .withMessage('Email không phù hợp'),
        check('address')
            .not()
            .isEmpty()
            .withMessage('Địa chỉ bắt buộc')
    ],
    validUpdateProfile: [
        check('name')
            .not()
            .isEmpty()
            .withMessage('Full name is required')
            .trim()
            .isLength({ max: 60 })
            .withMessage('Full name must be <60 chars long')
            .isLength({ min: 5 })
            .withMessage('Full name be at least 5 chars long'),
        check('birthday')
            .not()
            .isEmpty()
            .withMessage('Birthday is required')
    ],
    validChangePassword: [
        check('password')
            .not()
            .isEmpty()
            .withMessage('Password is required'),
        check('newPassword')
            .not()
            .isEmpty()
            .withMessage('New Password is required')
            .isLength({ min: 5 })
            .withMessage('The password must be at least 5 chars long')
            .matches(/\d/)
            .withMessage('The password must contain a number')
            .not()
            .isIn(['12345', '123456', 'password'])
            .withMessage('Do not use a common word as the password ex: 12345, 123456, ...'),
        check('confirmPassword')
            .custom((value, { req }) => {
                if (value !== req.body.newPassword) {
                    // throw error if passwords do not match
                    throw new Error("Confirm Password don't match");
                } else {
                    return value;
                }
            })
    ],
    validResetPassword: [
        check('otp')
            .not()
            .isEmpty()
            .withMessage('Otp is required')
        ,
        check('newPassword')
            .not()
            .isEmpty()
            .withMessage('New Password is required')
            .isLength({ min: 5 })
            .withMessage('The password must be at least 5 chars long')
            .matches(/\d/)
            .withMessage('The password must contain a number')
            .not()
            .isIn(['12345', '123456', 'password'])
            .withMessage('Do not use a common word as the password ex: 12345, 123456, ...'),
        check('confirmPassword')
            .custom((value, { req }) => {
                if (value !== req.body.newPassword) {
                    // throw error if passwords do not match
                    throw new Error("Confirm Password don't match");
                } else {
                    return value;
                }
            })
    ]
}