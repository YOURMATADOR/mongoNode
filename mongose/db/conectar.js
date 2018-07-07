const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/mogose');
//conectar a una base de datos desde mongoose


module.exports = {
    mongoose
}