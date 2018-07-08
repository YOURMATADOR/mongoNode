const {modelo} = require('./../db/modelo');
const {mongoose} = require('./../db/conectar');
const {ObjectID} = require('mongodb');


console.log('hola');

let id = "5b4125d0777e4e590a13cd70";


if(!ObjectID.isValid(id)) return console.log('Id invalido');

modelo.find({
    _id: id
}).then((result) => {
  console.log(result);  
}).catch((err) => {
    console.log(err);
});

modelo.findById(id)
.then((result) => {
    console.log(result);
}).catch((err) => {
    console.log(err);
});


//promise
modelo.findOne({
    _id: id
})
.then((result) => {
    console.log(result);
}).catch((err) => {
    console.log(err);
});

//callback
modelo.findOne(
    {
        _id: id 
    },
    (err,res)=>{
    if(err)    return console.log(err);

    console.log(res);
    }

)
// async await
modelo.findOne({
    _id:id
},
async (err,res)=>{
    console.log("Async", await res);
})


