const config = require('./config/config');
const {mongoose} = require('./db/conectar'); //internos
const {modelo, usuarios} = require('./db/modelo');
const {  usuariosModelo} = require('./db/usuario');
const actualiza = require('./actualizar');
const bodyParse = require('body-parser'); // externos
const express = require('express');
const validos = require('./idValida');
const eliminar = require('./eliminarR');
const PORT = process.env.PORT;
const _ = require('lodash');
const app = express();
const {
    autenticar
} = require('./db/autenticar');
app.use(bodyParse.json());
app.use('/', validos.router);
app.use('/', actualiza.router);
app.use('/', eliminar.router);

app.post('/todo',autenticar,(req, res) => {
    console.log(req.usuario);

    let Modelo = new modelo({
        nombre: req.body.nombre,
        edad: req.body.edad,
        _creador: req.usuario[0]._id
    });

    Modelo.save().then((result) => {
        console.log(result);
        res.send(result);
    }).catch((err) => {
        res.status(400).send(err);
    });


}); //agrega una nueva nota a la base de datos local y al modelo mongose como de especifica en el modelo de el archivo /db/modelo.js

app.get('/todo',autenticar ,(req, res) => {
    modelo.find({_creador:req.usuario[0]._id})
        .then((result) => {
            res.send({
                result
            });
        }).catch((err) => {
            res.status(400).send(err);
        });
});

/** 
 *TODO: 
 *realizar un router en otro archivo para importar la funcionalidad de una ruta privada para auth
 */

app.post('/usuarios', (req, res) => {


    let cuerpo = _.pick(req.body, ['email', 'password']);

    var nuevoUser = new usuarios(cuerpo);

    nuevoUser.save()
        .then(() => {

            return nuevoUser.generarAuth();
        })
        .then((token) => {
            var filtrado = _.pick(nuevoUser, ['_id', 'email']);

            res.header('x-auth', token).send(filtrado);
        })
        .catch((err) => {
            return res.status(404).send(err);
        });

});

app.get('/usuarios/me', autenticar, (req, res) => {
    res.send(req.usuario);
    console.log(req.llave);

});

//iniciar sesion 
app.post('/usuarios/login', (req, res) => {
    let cuerpo = _.pick(req.body, ['email', 'password']);
    return usuarios.comprobarPass(cuerpo.email, cuerpo.password)
        .then((result) => {
            res.header('x-auth', result.tokens[0].token).send(result);
        }).catch((err) => {
            res.status(404).send(err);
        });

})

app.delete('/usuarios/salir', autenticar, (req, res) => {
   return usuarios.cerrarStatic(req.llave)
        .then((result) => {
            res.status(200).send();
        }).catch((err) => {
            res.status(400);
        });

});



app.listen(PORT, () => {
    console.log(`aplicacion montada en el puerto ${PORT}`);
});



module.exports = {
    app
};