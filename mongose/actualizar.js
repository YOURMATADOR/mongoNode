const express = require('express');
const router = express.Router();
const {
    ObjectID
} = require('mongodb');
const {
    modelo
} = require('./db/modelo');
const _ = require('lodash');
const bodyParse = require('body-parser'); // externos
const {autenticar}= require('./db/autenticar');

router.use(bodyParse.json());

router.patch('/todo/:id',autenticar, (req, res, next) => {
    var body = _.pick(req.body, ['nombre', 'edad']);

    if (!ObjectID.isValid(req.params.id)) return res.status(404).send({
        status: 404,
        type: 'Id no valida'
    });
modelo.findOneAndUpdate({_id: req.params.id,_creador: req.usuario[0]._id},{
        $set: body
    },{new: true})
    .then((result) => {
        if (!result) return res.status(404).send({
            status: 404,
            type: 'El elemento con dicha Id no existe'
        });
        res.send({result});
    }).catch((err) => {
        return res.status(404).send({
            status: 404,
            type: err
        });

    });
    
});

module.exports = {
    router
}