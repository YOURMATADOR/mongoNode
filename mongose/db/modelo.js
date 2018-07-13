const mongoose = require('mongoose');
const valido = require('validator');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // encripta los password
let modelo = mongoose.model('mogose', {
    nombre: {
        type: String,
        required: true
    },
    edad: Number,

    _creador:{
        type: mongoose.Schema.Types.ObjectId,
        required:true
    }

});

let usuariosSquema = new mongoose.Schema({
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        minlength: 1,
        validate: {
            validator: valido.isEmail,
            message: '{VALUE} no es email valido'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]

})

usuariosSquema.statics.buscarPorId = function (llave) {

    try {
        var valores = jwt.verify(llave, process.env.JWTSECRETO);
    } catch (e) {
        return Promise.reject('Header invalido');
    }

    return this.find({
        _id: valores._id,
        'tokens.token': llave,
        'tokens.access': 'auth'

    })
}



usuariosSquema.methods.generarAuth = function () {
    var access = 'auth';
    var token = _.toString(jwt.sign({
        _id: this._id.toHexString(),
        access
    }, process.env.JWTSECRETO));

    this.tokens.push({
        access,
        token
    }); //agregas un nue

    return this.save()
        .then(() => {
            return token;
        });
}

usuariosSquema.methods.cerrarSesion = function (token) {


  }

  usuariosSquema.statics.cerrarStatic = function (token) {
      return this.updateMany({$pull:{tokens:{token}}});

  }
usuariosSquema.statics.comprobarPass = function (email, passs) {
    return this.findOne({
            email
        })
        .then((e) => {
            console.log(e);
            return new Promise((resolve, reject) => {
                bcrypt.compare(passs, e.password, (err, res) => {


                    if (res) {
                        resolve(e);
                    } else {
                        reject();
                    }
                })


            })

        })
}

//encripta la contraseña del usuario
usuariosSquema.pre('save', function (next) {
var us = this;
    if (us.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(us.password, salt, (err, hash) => {
                console.log('antes', hash);
                us.password = hash;
                next();

            });
        });
    } else {
        next();
    }
});


let usuarios = mongoose.model('usuarios', usuariosSquema);


// usuarios.statics.buscarTiposSimilares =function(arr){
//     console.log(this);
// return new Promise((resolve, reject) => {
//             this.find({

//                     usuario: new RegExp(name, 'i')

//             }).then((result) => {
//                 resolve(result);
//             }).catch((err) => {
//                 reject(err);
//             });


// })
// }
module.exports = {
    usuarios,
    modelo
}