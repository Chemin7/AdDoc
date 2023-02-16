const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({extended: false}));

app.set('view engine', 'ejs');
app.set('views', 'views');

//Telling the express module that public dir has all of our site assets
app.use(express.static(path.join(__dirname, '/public')));

const citasRouter = require('./routes/citas')

app.get('/',(req,res)=>{
    res.render('../views/citas.ejs')

})
app.get('/citas',(req,res)=>{
    res.render('../views/citas.ejs')

})
//app.use('/citas',citasRouter);

app.listen(PORT);

