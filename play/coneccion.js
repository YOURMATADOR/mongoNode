const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');


// Database Name
const dbName = 'myproject';

// Use connect method to connect to the server
MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true }, function (err, client) {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    const db = client.db(dbName);
db.collection('node').insertMany([
    {nombre: 'Eduardo'},{nombre: 'Pepe'},{nombre: 'CHABELO'}


], (err,result)=>{
    console.log(JSON.stringify(result.ops, undefined,2));
});

db.collection('node').find({}).toArray((err,result)=>{
assert.equal(null,err);
console.log(result);
})
    client.close();
});
