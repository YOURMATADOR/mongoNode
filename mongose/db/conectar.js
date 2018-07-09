const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect((process.env.MONGODB_URL) || "mongodb://localhost:27017/mogose");
//conectar a una base de datos desde mongoose


module.exports = {
    mongoose
}