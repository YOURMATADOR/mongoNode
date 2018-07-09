const express= require('express');
const router = express.Router();
const {ObjectID}= require('mongodb');
const {modelo} = require('./db/modelo');

router.get('/todo/del/:id',(req,res,next)=>{

    if(!ObjectID.isValid(req.params.id)) return res.status(404).send({
        status: 404,
        type: 'Id no valida'
    });

next()
},(req,res,next) =>{

modelo.findOneAndRemove({
    _id: req.params.id
})
.then((result) => {
    if(!result) return res.status(404).send({
        status:404,
        type:'El elemento con dicha Id no existe'
    });
    res.send(result);
}).catch((err) => {
    return res.status(404).send({
        status: 404,
        type: err
    });
    
});
});

router.delete('/todo/:id', (req, res) => {

    if (!ObjectID.isValid(req.params.id)){return res.status(404).send({
        status: 404,
        type: 'Id no valida'
    });
    }
   modelo.findByIdAndRemove(req.params.id)
       .then((result) => {
           if (!result) {
               return res.status(404).send({
                   status: 404,
                   type: 'El elemento con dicha Id no existe'
               });
           }

           res.send({result});
       }).catch((err) => {
           console.log(err);
           res.status(404).send({
               status: 404,
               type: err
           });

       });
})


module.exports ={
    router
}