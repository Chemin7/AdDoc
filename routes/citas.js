const citasRouter = require('express').Router();

module.exports = citasRouter;

citasRouter.get('/',(req,res)=>{
    res.render('citas');
})

citasRouter.post('/',(req,res)=>{
    console.log(req.body)
    res.send(req.query)
})
