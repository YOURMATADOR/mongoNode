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

router.use(bodyParse.json());

router.patch('/todo/:id', (req, res, next) => {
    var body = _.pick(req.body, ['nombre', 'edad']);

    if (!ObjectID.isValid(req.params.id)) return res.status(404).send({
        status: 404,
        type: 'Id no valida'
    });
modelo.findByIdAndUpdate(req.params.id,{
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