const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGODB_URI);
//conectar a una base de datos desde mongoose


module.exports = {
    mongoose
}