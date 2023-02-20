const pruebaRouter = require('express').Router();

module.exports = pruebaRouter;

pruebaRouter.get('/',(req,res)=>{
    res.render('prueba');
})

pruebaRouter.post('/',(req,res)=>{
    console.log(req)
    res.send(JSON.stringify(req.body))
})