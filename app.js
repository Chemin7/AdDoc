const express = require('express');

const app = express();
const PORT = 3000;

app.get('/',(req,res)=>{
    res.render('login.ejs')
})

app.listen(PORT);

