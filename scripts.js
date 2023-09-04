async function rutExists(rut) {
    try {
        let response = await fetch('procesar.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'action=search&rut=' + rut
        });

        let result = await response.text();
        return result === 'exists';
    } catch(error) {
        console.error("Hubo un error al verificar el RUT:", error);
        return false;
    }
}

// Función para guardar datos
async function saveData() {
    const rut = document.getElementById('rut').value;

    if(await rutExists(rut)) {
        const overwrite = confirm('El RUT ya está registrado. ¿Desea sobreescribir la información existente?');
        if(!overwrite) {
            return; // No guardar si el usuario no quiere sobreescribir.
        }
    }

    console.log("Guardando datos...");
    let formData = new FormData(document.getElementById('medicalForm'));
    formData.append('action', 'save');
    
    try {
        let response = await fetch('procesar.php', {
            method: 'POST',
            body: formData
        });
        
        let result = await response.text();
        console.log("Resultado del guardado:", result);

        if (result == 'saved') {
            alert('Datos guardados correctamente.');
        } else {
            alert('Error al guardar los datos.');
        }
    } catch(error) {
        console.error("Hubo un error al guardar los datos:", error);
    }
}

// Evento para guardar
document.getElementById('saveBtn').addEventListener('click', async function() {
    console.log("Intentando guardar...");
    const rut = document.getElementById('rut').value;
    
    if(!rut) {
        alert('Por favor, ingrese un RUT.');
        return;
    }

    saveData();
});

// Evento de búsqueda
document.getElementById('searchBtn').addEventListener('click', async function() {
    console.log("Buscando RUT...");
    const rut = document.getElementById('searchRut').value;
    
    if(!rut) {
        alert('Por favor, ingrese un RUT para buscar.');
        return;
    }

    try {
        let response = await fetch('procesar.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'action=search&rut=' + rut
        });

        let result = await response.text();
        console.log("Resultado de la búsqueda:", result);

        if (result == 'exists') {
            alert('RUT registrado en la base de datos.');
        } else {
            alert('RUT no existe.');
        }
    } catch(error) {
        console.error("Hubo un error al buscar el RUT:", error);
    }
});

// Evento para limpiar
document.getElementById('clearBtn').addEventListener('click', function() {
    console.log("Limpiando formulario...");
    document.getElementById('medicalForm').reset();
    document.getElementById('searchRut').value = '';
});

// Evento para cerrar
document.getElementById('closeBtn').addEventListener('click', function() {
    console.log("Cerrando formulario...");
    window.close();
});

// Evento para cerrar
document.getElementById('closeBtn').addEventListener('click', function() {
    alert("Por favor, cierre esta ventana o pestaña manualmente.");
});
