const {
    ObjectID
} = require('mongodb');
const {
    modelo,
    usuarios
} = require('./../db/modelo');
const jwt = require('jsonwebtoken'); // genera un json web token 
let agregar = (done) => {
    modelo.deleteMany({})
        .then(() => {
            modelo.insertMany({
                _id: info.id,
                nombre: info.nombre,
                _creador: info._creador
            }).then(() => {
                done();
            });
        });
    // usuarios.deleteMany({})
    //     .then(() => {
    //         usuarios.insertMany({
    //                 usuario: 'Eduardo'
    //             })
    //             .then((res) => {
    //                 done();
    //             })
    //     })
}
//agregar usuarios 

let agregarUsuarios = (done) => {

    usuarios.deleteMany({})
        .then((result) => {
            let usrUno = new usuarios(Tokens[0]).save();
            let usrDos = new usuarios(Tokens[1]).save();

            return Promise.all([usrUno,usrDos]);
        }).then(()=>{done();})
        .catch((err) => {
done(err);
        });
}



//informacion sobre tokens 
let usuarioUno = new ObjectID();
let usuarioDos = new ObjectID();
let Tokens = [{

        _id: usuarioUno,
        email: "eduardo@example.com",
        password: 'password123',
        tokens: [{
            access: 'auth',
            token: jwt.sign({
                _id: usuarioUno,
                access: 'auth'
            }, process.env.JWTSECRETO).toString()
        }]
    },
    {
        _id: usuarioDos,
        email: "eduardoDos@example.com",
        password: 'password123'
    }
]


//informacion sobre usuarios
let info = {
    nombre: "Supertest",
    id: new ObjectID('5b4125d0777e4e590a13cd70'),
    text: 'Uhh UHH',
    edad: '50',
    idInvalida: '5b4125d0777e4e590a13cd702www',
    idDistinta: new ObjectID('6b4125d0777e4e590a13cd70'),
    _creador: usuarioUno


}


//exportar las funciones y los objetos

module.exports = {
    info,
    agregar,
    Tokens,
    agregarUsuarios
}