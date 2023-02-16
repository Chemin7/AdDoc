const citas = [];

module.exports = class Citas{
    constructor(fecha,nombre,telefono){
        this.fecha = fecha;
        this.nombre = nombre;
        this.telefono = telefono;
    }

    save(){
        citas.push(this);
    }

    fetchAll(){
        return this.citas;
    }
}