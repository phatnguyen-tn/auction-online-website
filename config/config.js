module.exports = {
    PORT: process.env.PORT || 8888,
    DB: 'mongodb://localhost:27017/auction',
    SECRET: process.env.SECRET || 'abc..xyz',
    EMAIL_USER: process.env.EMAIL_USER || 'example@gmail.com',
    EMAIL_PASS: process.env.EMAIL_PASS || '123456',
    PER_PAGE: 10
}