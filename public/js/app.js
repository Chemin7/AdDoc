//Campos del formulario
const mascotaInput = document.querySelector('#mascota');
const propietarioInput = document.querySelector('#propietario');
const telefonoInput = document.querySelector('#telefono');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');
const sintomasInput = document.querySelector('#sintomas');

//UI
const formulario = document.querySelector('#nueva-cita');
const contenedorCitas = document.querySelector('#citas');

let editando;

class Citas{
    constructor(){
        this.citas = [];
    }
    agregarCita(cita){
        this.citas=[...this.citas, cita];
    }
    eliminarCita(id){
        this.citas = this.citas.filter(cita=>cita.id!=id);
    }

    editarCita(citaActualizada){
        this.citas = this.citas.map(cita=> cita.id===citaActualizada.id ? citaActualizada : cita) //.Map Nos retorna un nuevo arreglo
    }
}

class UI{
    imprimirAlerta(msj,tipo){
        //Crear el div
        const divMensaje = document.createElement('DIV');
        divMensaje.classList.add('text-center', 'alert', 'd-block','col-12');

        //Agregar clase en base al tipo de error
        if(tipo === 'error'){
            divMensaje.classList.add('alert-danger');
        }else{
            divMensaje.classList.add('alert-success');
        }

        //Mensaje de erro
        divMensaje.textContent = msj;

        //Agregar al DOM
        
        document.querySelector('#contenido').insertBefore(divMensaje,document.querySelector('.agregar-cita'));

        //Quitar la alerta
        setTimeout(()=>{
            divMensaje.remove();
        },3000)
    }

    imprimirCitas({citas}){
        this.limpiarHTML();
        citas.forEach(cita=>{
            const {mascota,propietario,telefono,fecha,hora,sintomas,id} = cita;

            const divCita = document.createElement('DIV');
            divCita.classList.add('cita','p-3');
            divCita.dataset.id = id; //Atributo personalizado
            
            //Scripting de los atributos de la cita
            const mascotaParrafo = document.createElement('h2');
            mascotaParrafo.classList.add('card-title','font-weight-bolder');
            mascotaParrafo.textContent = mascota;

            const propietarioParrafo = document.createElement('p');
            propietarioParrafo.innerHTML = `
                <span class = "font-weight-bolder">Propietario: </span> ${propietario}
            `
            const telefonoParrafo = document.createElement('p');
            telefonoParrafo.innerHTML = `
                <span class = "font-weight-bolder">Telefono: </span> ${telefono}
            `
            const fechaParrafo = document.createElement('p');
            fechaParrafo.innerHTML = `
                <span class = "font-weight-bolder">Fecha: </span> ${fecha}
            `
            const horaParrafo = document.createElement('p');
            horaParrafo.innerHTML = `
                <span class = "font-weight-bolder">Hora: </span> ${hora}
            `
            const sintomasParrafo = document.createElement('p');
            sintomasParrafo.innerHTML = `
                <span class = "font-weight-bolder">Sintomas: </span> ${sintomas}
            `

            //Boton para eliminar cita
            const btnEliminar = document.createElement('button');
            btnEliminar.classList.add('btn','btn-danger','mr-2');
            btnEliminar.innerHTML = 'Eliminar <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>'
            
            btnEliminar.onclick = ()=>eliminarCita(id);

            //Anade un boton para editar
            const btnEditar = document.createElement('button');
            btnEditar.classList.add('btn','btn-info');
            btnEditar.innerHTML = 'Editar <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>';
            btnEditar.onclick = ()=>cargarEdicion(cita);

            //Agregar los parrafos al divCita
            divCita.appendChild(mascotaParrafo);
            divCita.appendChild(propietarioParrafo);
            divCita.appendChild(telefonoParrafo);
            divCita.appendChild(fechaParrafo);
            divCita.appendChild(horaParrafo);
            divCita.appendChild(sintomasParrafo);
            divCita.appendChild(btnEliminar)
            divCita.appendChild(btnEditar)

            //Agregar las citas al HTML
            contenedorCitas.appendChild(divCita);

        })
    }
    limpiarHTML(){
        while(contenedorCitas.firstChild){
            contenedorCitas.removeChild(contenedorCitas.firstChild)
        }
    }
}

const ui = new UI();
const administrarCitas = new Citas();
//Registrar eventos
eventListeners()
function eventListeners(){
    mascotaInput.addEventListener('input',datosCita);
    propietarioInput.addEventListener('input',datosCita);
    telefonoInput.addEventListener('input',datosCita);
    fechaInput.addEventListener('input',datosCita);
    horaInput.addEventListener('input',datosCita);
    sintomasInput.addEventListener('input',datosCita);

    formulario.addEventListener('submit',nuevaCita);
}

//Objeto con la informacion de la cita
const citaObj = {
    mascota: '',
    propietario: '',
    telefono: '',
    fecha: '',
    hora: '',
    sintomas: ''
}

//Agrega datos al objeto de cita
function datosCita(e){
    citaObj[e.target.name] = e.target.value

}

//Valida y agrega una nueva cita a la clase de citas
function nuevaCita(e){
    e.preventDefault();

    //Extraer informacion del objeto de citas
    const {mascota,propietario,telefono,fecha,hora,sintomas} = citaObj;

    //Validar
    if(mascota === '' || propietario === '' || telefono === '' || fecha ==='' || hora ==='' || sintomas === ''){
        ui.imprimirAlerta('Todos los campos son obligatorios', 'error')
        return;
    }if(editando){
        ui.imprimirAlerta('Editado correctamente');

        //Pasar el objeto de la cita a edicion
        administrarCitas.editarCita({...citaObj});


        //Regresar el texto del boton a su estado original
        formulario.querySelector('button[type = "submit"]').textContent = 'Crear cita';

        //Quitar modo edicion
        editando = false;
    }else{
        //Generar un ID unico
        citaObj.id = Date.now();

        //Creando una nueva cita
        administrarCitas.agregarCita({...citaObj}) //Le mandamos una copia nada mas y no el objeto global, para evitar que se sobreescriba la misma informacion
        //Mensaje de agregado correctament
        ui.imprimirAlerta('Cita agregada correctamente');
    }




    //Reiniciar el objeto para la validacion
    reiniciarObj();

    //Reiniciar el formulario
    formulario.reset();

    //Mostrar el HTML de las citas
    ui.imprimirCitas(administrarCitas);


}

function reiniciarObj(){
    citaObj.mascota = '';
    citaObj.propietario = '';
    citaObj.telefono = '';
    citaObj.fecha = '';
    citaObj.hora = '';
    citaObj.sintomas = '';

}

function eliminarCita(id){
    //Eliminar la cita
    administrarCitas.eliminarCita(id);
    //Muestra un mensaje
    ui.imprimirAlerta('La cita se elimino correctamente');
    //Refresa las citas
    ui.imprimirCitas(administrarCitas)
}
//Carga los datos y el modo edicion
function cargarEdicion(cita){
    const {mascota,propietario,telefono,fecha,hora,sintomas,id} = cita;

    //Llenar los inputs
    mascotaInput.value = mascota;
    propietarioInput.value = propietario;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    sintomasInput.value = sintomas;

    //Llenar el objeto
    citaObj.mascota = mascota;
    citaObj.propietario = propietario;
    citaObj.telefono = telefono;
    citaObj.fecha = fecha;
    citaObj.hora = hora;
    citaObj.sintomas = sintomas ;
    citaObj.id = id;

    //Cambiar el texto del boton
    formulario.querySelector('button[type = "submit"]').textContent = 'Guardar Cambios';
    editando = true;
}