/*const Cita = require('../models/cita');

exports.getAddCita = (req,res,next)=>{
    res.render('index.ejs')
}

exports.postAddCita = (req,res,next)=>{
    let nombre = req.body.nombre;
    let fecha = req.body.fecha;
    let telefono = req.body.telefono;
    const cita = new Cita(fecha,nombre,telefono);
    cita.save();
    res.redirect('/');
}*/