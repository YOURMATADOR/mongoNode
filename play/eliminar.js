const {
    MongoClient,
    ObjectID
} = require('mongodb');
const assert = require('assert');



MongoClient.connect('mongodb://localhost:27017', {
        useNewUrlParser: true
    })
    .then((result) => {
        let base = result.db('myproject');
        base.collection('node')
           .deleteMany({nombre:'CHABELO'})
           .then((res)=>{
            console.log('eliminados con exito');
           });

           base.collection('node')
               .findOneAndDelete({ _id: new ObjectID('5b3bfb33f833d4489eae311c')})
               .then( (res) =>{
                   console.log(res);
               });
               base.collection('node')
               .updateOne({nombre: 'papu'},
                   { 
                       $inc: { edad: 20 } 
                    ,
                 $set: {nombre:'ñpñ'}
                  }  // se incremeta mas 20 la edad y e cambia el nombre por ñpñ
               )
               .then((result) => {
                   console.log('result');
               }).catch((err) => {
                   
               });


    })
    .catch((err) => {
        console.log(err);
    });