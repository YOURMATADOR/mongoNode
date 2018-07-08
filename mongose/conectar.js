const {mongoose} = require('./db/conectar'); //internos
const {modelo} = require('./db/modelo');
const {usuariosModelo} = require('./db/usuario');
 
const bodyParse = require('body-parser'); // externos
const express = require('express');
const validos = require('./idValida');

const app = express();

app.use(bodyParse.json());
app.use('/',validos.router);
app.post('/todo', (req, res) => {
   console.log( req.body);

let Modelo = new modelo({
    nombre: req.body.nombre,
    edad: req.body.edad
});

Modelo.save().then((result) => {
    console.log(result);
    res.send(result);
}).catch((err) => {
    res.status(400).send(err);
});


}); //agrega una nueva nota a la base de datos local y al modelo mongose como de especifica en el modelo de el archivo /db/modelo.js

app.get('/todo', (req, res) => {
    modelo.find()
    .then((result) => {
    res.send({result});
    }).catch((err) => {
        res.status(400).send(err);
    });
});

app.listen(3000, () => {
    console.log('App listening on port 3000!');
});

module.exports ={app};