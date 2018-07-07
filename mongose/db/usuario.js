const mongoose = require('mongoose');


let usuariosModelo = mongoose.model('usuario', {
    usuario: {
        type: String,
        required: true,
        trim: true

    },
    email: {
        type: String,
        required: true,
        trim: true
    }
});

module.exports = {
usuariosModelo
}