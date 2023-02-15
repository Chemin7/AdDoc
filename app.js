const express = require('express');

const app = express();
const PORT = 3000;
const citasRouter = require('./routes/citas')
app.get('/',(req,res)=>{
    res.render('index.ejs')
})

app.use('/citas',citasRouter);

app.listen(PORT);

