require('babel-register')({ ignore: /!(express-hogan-cache\/lib)/ })

module.exports = require('./lib')
