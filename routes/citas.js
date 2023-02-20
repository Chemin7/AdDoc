const citasRouter = require('express').Router();

module.exports = citasRouter;

citasRouter.get('/',(req,res)=>{
    res.render('citas');
})

citasRouter.post('/',(req,res)=>{
    console.log(JSON.stringify(req.body));
    res.send(JSON.stringify(req.body))
})
