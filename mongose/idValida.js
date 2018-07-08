const express = require('express');
const router = express.Router(); 
const {ObjectId}= require('mongodb');
const {modelo}= require('./db/modelo');


router.get('/todo/:id',(req,res,next)=>{


console.log(req.params.id);

if(!ObjectId.isValid(req.params.id))return res.status(404).send({
    status: 404,
    type: 'Id no valida'
});

next();


},(req,res,next)=>{

modelo.findById(req.params.id)
.then((result) => {
    if(!result)  return res.status(404).send({
        status: 404,
        type: 'No se encontraron elementos con dicha ID.'
    });
res.send(result);
}).catch((err) => {
    return res.status(404).send({
        status: 404,
        type: err
    });
});
}
);



module.exports={
    router
}