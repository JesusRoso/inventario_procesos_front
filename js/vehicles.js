const urlApi = "http://localhost:8088";//colocar la url con el puerto

function listar(){
    validaToken();
    var settings={
        method: 'GET',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.token
        },
    }
    fetch(urlApi+"/vehicles",settings)
    .then(response => response.json())
    .then(function(vehicles){
            var vehiculos = '';
            for(const vehicle of vehicles){
                var availability = vehicle.availability;
                if(availability){
                    availability = "Si"
                }
                else{
                    availability = "No"
                }
                vehiculos += `
                <tr>
                    <th scope="row">${vehicle.id}</th>
                    <td>${vehicle.car}</td>
                    <td>${vehicle.car_model}</td>
                    <td>${vehicle.car_color}</td>
                    <td>${vehicle.car_model_year}</td>
                    <td>${vehicle.price}</td>
                    <td>${availability }</td>
                    <td>${vehicle.user.firtsName + " "+vehicle.user.LastName}</td>
                    <td>
                    <a href="#" onclick="verModificarUsuario('${vehicle.id}')" class="btn btn-outline-warning">
                        <i class="fa-solid fa-user-pen"></i>
                    </a>
                    <a href="#" onclick="verUsuario('${vehicle.id}')" class="btn btn-outline-info">
                        <i class="fa-solid fa-eye"></i>
                    </a>
                    </td>
                </tr>`;
                
            }
            document.getElementById("listarVehicle").innerHTML = vehiculos;
    })
}

function registerForm(){
    cadena = `
            <div class="p-3 mb-2 bg-light text-dark">
                <h1 class="display-5"><i class="fa-solid fa-user-pen"></i>Registro del Vehículo</h1>
            </div>
              
            <form action="" method="post" id="registerForm">
                <label for="firstName" class="form-label">Id del carro</label>
                <input type="text" class="form-control" name="id" id="id" required> <br>
                <label for="lastName" class="form-label">Id del usuario</label>
                <input type="text" class="form-control" name="id_user" id="id_user" required> <br>
                <button type="button" class="btn btn-outline-info" onclick="registerVehicle()">Register</button>
            </form>`;
            document.getElementById("contentModal").innerHTML = cadena;
            var myModal = new bootstrap.Modal(document.getElementById('modalUsuario'))
            myModal.toggle();
}

async function registerVehicle(){
    const idVehicle = document.getElementById("id").value;
    const idUser = document.getElementById("id_user").value;
    const token = localStorage.getItem('token');
    try{
        const request = await fetch(urlApi+"/saveVehicle/"+idVehicle+"/"+idUser, {
            method: 'POST',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            },
        });
        if (!request.ok) {
            throw new Error('Error al hacer la solicitud. Código de respuesta: ' + request.status);
          }
        listar();
        alertas("Se ha registrado el vehículo exitosamente!",1)
        document.getElementById("contentModal").innerHTML = '';
        var myModalEl = document.getElementById('modalUsuario')
        var modal = bootstrap.Modal.getInstance(myModalEl) // Returns a Bootstrap modal instance
        modal.hide();
    }catch(error){
        Swal.fire({
            icon: 'error',
            title: 'Hubo un error',
            text: error.message
          })
    }
}

function verUsuario(id){
    validaToken();
    var settings={
        method: 'GET',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.token
        },
    }
    fetch(urlApi+"/vehicle/"+id,settings)
    .then(response => response.json())
    .then(function(response){
            var cadena='';
            var vehicle = response;
            if(vehicle){           
                var availability = vehicle.availability;
                if(availability){
                    availability = "Si"
                }
                else{
                    availability = "No"
                }     
                cadena = `
                <div class="p-3 mb-2 bg-light text-dark">
                    <h1 class="display-5"><i class="fa-solid fa-user-pen"></i>Ver Vehículo</h1>
                </div>
                <ul class="list-group">
                    <li class="list-group-item">Carro: ${vehicle.car}</li>
                    <li class="list-group-item">Modelo: ${vehicle.car_model}</li>
                    <li class="list-group-item">Color: ${vehicle.car_color}</li>
                    <li class="list-group-item">Año modelo: ${vehicle.car_model_year}</li>
                    <li class="list-group-item">Precio: ${vehicle.price}</li>
                    <li class="list-group-item">Disponibilidad: ${availability}</li>
                    <li class="list-group-item">Nombre del dueño: ${vehicle.user.firtsName + " "+vehicle.user.LastName}</li>
                </ul>`;
              
            }
            document.getElementById("contentModal").innerHTML = cadena;
            var myModal = new bootstrap.Modal(document.getElementById('modalUsuario'))
            myModal.toggle();
    })
}

function verModificarUsuario(id){
    validaToken();
    var settings={
        method: 'GET',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.token
        },
    }
    fetch(urlApi+"/vehicle/"+id,settings)
    .then(response => response.json())
    .then(function(response){
            var cadena='';
            var vehicleComplete = response;
            var valueAvailability = vehicleComplete.availability;
            if(vehicleComplete){                
                cadena = `
                <div class="p-3 mb-2 bg-light text-dark">
                    <h1 class="display-5"><i class="fa-solid fa-user-pen"></i>Modify User</h1>
                </div>
              
                <form action="" method="post" id="modifyForm">
                    <input type="hidden" name="id" id="id" value="${vehicleComplete.id}">
                    <label for="car" class="form-label">Carro</label>
                    <input type="text" class="form-control" name="car" id="car" required value="${vehicleComplete.car}"> <br>
                    <label for="car_model"  class="form-label">Modelo de carro</label>
                    <input type="text" class="form-control" name="car_model" id="car_model" required value="${vehicleComplete.car_model}"> <br>
                    <label for="car_color" class="form-label">Color del carro</label>
                    <input type="text" class="form-control" name="car_color" id="car_color" required value="${vehicleComplete.car_color}"> <br>
                    <label for="price" class="form-label">Año del modelo</label>
                    <input type="text" class="form-control" id="car_model_year" name="car_model_year" required value="${vehicleComplete.car_model_year}"> <br>
                    <label for="price" class="form-label">Precio</label>
                    <input type="text" class="form-control" id="price" name="price" required value="${vehicleComplete.price}"> <br>
                    <label for="price" class="form-label">Disponibilidad</label> <br>
                    <input type="radio" class="" id="availability1" name="availability" value="true">Si &nbsp;
                    <input type="radio" class="" id="availability2" name="availability" value="false">No <br> <br>
                    <button type="button" class="btn btn-outline-warning" 
                        onclick="modificarVehiculo('${vehicleComplete.id}')">Modificar
                    </button>
                </form>`;
                setTimeout(function() {
                    var radio1 = document.getElementById("availability1");
                    var radio2 = document.getElementById("availability2");
                    console.log(valueAvailability);
                    // Establece el valor inicial en uno de los radio buttons
                    if (valueAvailability) {
                      radio1.checked = true;
                    } else {
                      radio2.checked = true;
                    }
                  }, 500);
            }
            document.getElementById("contentModal").innerHTML = cadena;
            var myModal = new bootstrap.Modal(document.getElementById('modalUsuario'))
            myModal.toggle();
    })
}

async function modificarVehiculo(id){
    validaToken();
    var myForm = document.getElementById("modifyForm");
    var formData = new FormData(myForm);
    var jsonData = {};
    for(var [k, v] of formData){//convertimos los datos a json
        jsonData[k] = v;
    }
    const request = await fetch(urlApi+"/updateVehicle/"+id, {
        method: 'PUT',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.token
        },
        body: JSON.stringify(jsonData)
    });
    listar();
    alertas("Se ha modificado el usuario exitosamente!",1)
    document.getElementById("contentModal").innerHTML = '';
    var myModalEl = document.getElementById('modalUsuario')
    var modal = bootstrap.Modal.getInstance(myModalEl) // Returns a Bootstrap modal instance
    modal.hide();
}

function modalConfirmacion(texto,funcion){
    document.getElementById("contenidoConfirmacion").innerHTML = texto;
    var myModal = new bootstrap.Modal(document.getElementById('modalConfirmacion'))
    myModal.toggle();
    var confirmar = document.getElementById("confirmar");
    confirmar.onclick = funcion;
}

function alertas(mensaje,tipo){
    var color ="";
    if(tipo == 1){//success verde
        color="success"
    }
    else{//danger rojo
        color = "danger"
    }
    var alerta =`<div class="alert alert-${color} alert-dismissible fade show" role="alert">
                    <strong><i class="fa-solid fa-triangle-exclamation"></i></strong>
                        ${mensaje}
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                 </div>`;
    document.getElementById("datos").innerHTML = alerta;
}

function salir(){
    localStorage.clear();
    location.href = "index.html";
}

function validaToken(){
    if(localStorage.token == undefined){
        salir();
    }
}