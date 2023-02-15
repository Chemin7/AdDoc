const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

const citasRouter = require('./routes/citas')

app.get('/',(req,res)=>{
    res.render('login.ejs')
})

app.use('/citas',citasRouter);

app.listen(PORT);

