const mongoose = require('mongoose');

let modelo = mongoose.model('mogose', {
    nombre:{
type: String,
required: true
    },
    edad: Number

});


module.exports = {
    modelo
}