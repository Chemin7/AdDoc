const citasRouter = require('express').Router();
const Paciente  = require('../models/paciente')
const Cita  = require('../models/cita')
module.exports = citasRouter;

citasRouter.get('/',(req,res)=>{
    res.render('citas');
})

citasRouter.post('/',(req,res)=>{
    let paciente  = new Paciente(req.body.paciente,req.body.telefono);
    let cita = new Cita(req.body.fecha,req.body.hora,paciente);
    console.log(paciente)
    res.send(JSON.stringify({id:Date.now(),fecha:cita.fecha,hora:cita.hora,paciente:{nombre:paciente.nombre,telefono:paciente.telefono}}))
})

citasRouter.delete('/')
