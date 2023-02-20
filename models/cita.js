const citas = [];
const Paciente = require('./paciente');
let Person  = require('./paciente')
module.exports = class Citas{
    constructor(fecha,hora,paciente){

        this.fecha = fecha;
        this.hora = hora;
        this.paciente = paciente;
    }

    save(){
        citas.push(this);
    }

    fetchAll(){
        return this.citas;
    }
}