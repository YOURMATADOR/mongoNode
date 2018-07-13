const express = require('express');
const router = express.Router();
const {
    ObjectID
} = require('mongodb');
const {
    modelo
} = require('./db/modelo');
const {
    autenticar
} = require('./db/autenticar');
router.get('/todo/del/:id', autenticar, (req, res, next) => {

    if (!ObjectID.isValid(req.params.id)) return res.status(404).send({
        status: 404,
        type: 'Id no valida'
    });

    next()
}, (req, res, next) => {

    modelo.findOneAndRemove({
            _id: req.params.id
        })
        .then((result) => {
            if (!result) return res.status(404).send({
                status: 404,
                type: 'El elemento con dicha Id no existe'
            });
            res.send(result);
        }).catch((err) => {
            return res.status(404).send({
                status: 404,
                type: err
            });

        });
});

router.delete('/todo/:id', autenticar, (req, res) => {

    if (!ObjectID.isValid(req.params.id)) {
        return res.status(404).send({
            status: 404,
            type: 'Id no valida'
        });
    }
    console.log(req.params.id);
    modelo.findOneAndRemove({
            _id: req.params.id,
            _creador: req.usuario[0]._id
        })
        .then((result) => {
                    console.log(req.usuario);

            if (!result) {
                return res.status(404).send({
                    status: 404,
                    type: 'El elemento con dicha Id no existe'
                });
            }

            res.send({
                result
            });
        }).catch((err) => {
            console.log(err);
            res.status(404).send({
                status: 404,
                type: err
            });

        });
})


module.exports = {
    router
}