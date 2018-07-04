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
            .find({})
            .count()
            .then((result) => {
                console.log(result);
            })
            .catch((err) => {
                console.log(err);
            });
    })
    .catch((err) => {
        console.log(err);
    });