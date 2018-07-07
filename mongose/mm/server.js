const express = require('express');
const {router}= require('./pajaros');
const {routerIds} = require('./ids');
const path = require('path');
var hbs = require('express-handlebars');

let app = express();
app.use('/ids',routerIds);
app.engine('handlebars', hbs({
    defaultLayout: 'main',
       partialsDir: [
           //  path to your partials
           __dirname + '/views/partials',
       ]
}));



app.set("view engine", "handlebars");

app.use('/pajaros',router);
app.use((req,res,next)=>{
console.log(req.method);
console.log(req.originalUrl);
next();
});


app.get('/', (req, res) => {
    res.render('index',{
        titulo: 'Indice por eduardo avila con handlebars'
    });
});


app.listen(3000, () => {
    console.log('App listening on port 3000!');
});

