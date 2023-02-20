//Campos del formulario
const pacienteInput = document.querySelector('#paciente');
const telefonoInput = document.querySelector('#telefono');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');


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
    imprimirAlerta(mensaje,tipo){
        // Crea el div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert', 'd-block', 'col-12');
        
        // Si es de tipo error agrega una clase
        if(tipo === 'error') {
             divMensaje.classList.add('alert-danger');
        } else {
             divMensaje.classList.add('alert-success');
        }

        // Mensaje de error
        divMensaje.textContent = mensaje;

        // Insertar en el DOM
        document.querySelector('#contenido').insertBefore( divMensaje , document.querySelector('.agregar-cita'));

        // Quitar el alert despues de 3 segundos
        setTimeout( () => {
            divMensaje.remove();
        }, 3000);
    }

    imprimirCitas({citas}){
        this.limpiarHTML();
        citas.forEach(cita=>{
            const {paciente,telefono,fecha,hora,id} = cita;

            const divCita = document.createElement('DIV');
            divCita.classList.add('cita','p-3');
            divCita.dataset.id = id; //Atributo personalizado
            
            //Scripting de los atributos de la cita
            const pacienteParrafo = document.createElement('h2');
            pacienteParrafo.classList.add('card-title','font-weight-bolder');
            pacienteParrafo.textContent = paciente;

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
            divCita.appendChild(pacienteParrafo);
            divCita.appendChild(telefonoParrafo);
            divCita.appendChild(fechaParrafo);
            divCita.appendChild(horaParrafo);
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
    pacienteInput.addEventListener('input',datosCita);
    telefonoInput.addEventListener('input',datosCita);
    fechaInput.addEventListener('input',datosCita);
    horaInput.addEventListener('input',datosCita);

    formulario.addEventListener('submit',nuevaCita);
}

//Objeto con la informacion de la cita
const citaObj = {
    paciente: '',
    telefono: '',
    fecha: '',
    hora: '',
}

//Agrega datos al objeto de cita
function datosCita(e){
    citaObj[e.target.name] = e.target.value

}

//Valida y agrega una nueva cita a la clase de citas
function nuevaCita(e) {
    e.preventDefault();

    const {paciente, telefono, fecha, hora } = citaObj;

    // Validar
    if( paciente === '' || telefono === '' || fecha === ''  || hora === '' ) {
        ui.imprimirAlerta('Todos los mensajes son Obligatorios', 'error')

        return;
    }

    if(editando) {
        // Estamos editando
        administrarCitas.editarCita( {...citaObj} );

        ui.imprimirAlerta('Guardado Correctamente');

        formulario.querySelector('button[type="submit"]').textContent = 'Crear Cita';

        editando = false;

    } else {
        // Nuevo Registrando

        // Generar un ID único
        citaObj.id = Date.now();
        
        // Añade la nueva cita
        administrarCitas.agregarCita({...citaObj});

        // Mostrar mensaje de que todo esta bien...
        ui.imprimirAlerta('Se agregó correctamente')
    }


    // Imprimir el HTML de citas
    ui.imprimirCitas(administrarCitas);

    // Reinicia el objeto para evitar futuros problemas de validación
    reiniciarObjeto();

    // Reiniciar Formulario
    formulario.reset();

}


function reiniciarObj(){
    citaObj.paciente = '';
    citaObj.telefono = '';
    citaObj.fecha = '';
    citaObj.hora = '';

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
    const {paciente,telefono,fecha,hora,id} = cita;

    //Llenar los inputs
    pacienteInput.value = paciente;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;


    //Llenar el objeto
    citaObj.paciente = paciente;
    citaObj.telefono = telefono;
    citaObj.fecha = fecha;
    citaObj.hora = hora;
    citaObj.id = id;

    //Cambiar el texto del boton
    formulario.querySelector('button[type = "submit"]').textContent = 'Guardar Cambios';
    editando = true;
}