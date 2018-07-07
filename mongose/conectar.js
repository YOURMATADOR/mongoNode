const {mongoose} = require('./db/conectar'); //internos
const {modelo} = require('./db/modelo');
const {usuariosModelo} = require('./db/usuario');
 
const bodyParse = require('body-parser'); // externos
const express = require('express');


const app = express();
app.use(bodyParse.json());

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


})


app.listen(3000, () => {
    console.log('App listening on port 3000!');
});