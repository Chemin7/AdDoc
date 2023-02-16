const express = require('express');

const router = express.Router();

router.get('/',(req,res)=>{
    res.render('citas');
})
/*
router.post('/',(req,res,next)=>{
    const nombre_paciente = req.params.nombre;
    const email_paciente = req.parms.email;
    const telefono_paciente = req.params.paciente;

    //res.render('',{nombre:nombre_paciente, email:email_paciente,telefono:telefono_paciente});
});*/

module.exports = router;
