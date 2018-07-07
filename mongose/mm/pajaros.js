const express = require('express');
const router =express.Router();


router.use( (req,res,next)=>{
console.log(`La hora es: ${new Date()} `);
next();

});

router.get('/about',(req,res)=>{
res.send(('Sobre nosotros'));

});

module.exports = {
    router
}

