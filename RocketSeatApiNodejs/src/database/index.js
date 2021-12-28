const mongoose = require('mongoose')

mongoose.connect('mongodb://noderest:123456@localhost:27017/admin')
mongoose.Promise = global.Promise

module.exports = mongoose