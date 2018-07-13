const {usuarios}  = require('./modelo');
 let autenticar= (req,res,next)=>{
 let header = req.header('x-auth');

 usuarios.buscarPorId(header)
     .then((result) => {
         if (!result) {
             return new Promise.reject();
         }
         req.usuario = result;
         req.llave = header;
         next();
     }).catch((err) => {
         res.status(401).send(err);
     });
    }


    module.exports = {autenticar}