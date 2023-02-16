const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', 'views');

const citasRouter = require('./routes/citas')

app.get('/',(req,res)=>{
    //res.render('login.ejs')
    res.render('citas');
})

app.use('/citas',citasRouter);

app.listen(PORT);

