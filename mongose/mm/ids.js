const express = require('express');
const routerIds = express.Router(); // ejecuta multiples funciones en un path especifico 

routerIds.use((req,res,next)=>{
console.log(`Hora actual ${new Date()} metodo ${req.method}`);
next();
})
routerIds.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
routerIds.get('/:id',(req,res,next)=>{

    if(req.params.id == 0) next('route');

    else next()


},(req,res,next)=>{
res.send('Regular');
});


routerIds.get('/:id',(req,res,next)=>{

console.log('Id expecial');
res.send('Especial');

})

module.exports ={
    routerIds
}