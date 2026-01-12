const URL = "http://localhost:3030";

const specContainer = document.getElementById("specializationsContainer");

//- Cargar todas las especializaciones
async function loadSpecializations() {
    try {
        specContainer.textContent = "";
        let response = await fetch(`${URL}/specializations`);
        if (response.ok) {
            let specs = await response.json();
            specs.forEach(spec => insertSpecCard(spec));
        } else {
            throw new Error('Fallo al cargar las especializaciones');
        }
    } catch (error) {
        console.log("ERROR: ", error);
    }
}

//- Crear tarjeta 
function insertSpecCard(spec) {
    const card = document.createElement('div');
    card.classList.add('spec-card');

    card.innerHTML = `
        <h3>${spec.name}</h3>
        <p><strong>Descripción:</strong> ${spec.description}</p>
        <button class="delete" data-id="${spec.id}">Borrar</button>
        <button class="edit" data-id="${spec.id}">Editar</button>
    `;

    specContainer.append(card);
}

specContainer.addEventListener('click', async (event) => {
    const id = event.target.dataset.id;
    if (!id) return;

    if (event.target.classList.contains('delete')) await deleteSpec(id);
    
    if (event.target.classList.contains("edit")) {
        window.location.href = `editEspecializacion.html?id=${id}`;
    }
});

//- Eliminar 
async function deleteSpec(id) {
    try {
        let response = await fetch(`${URL}/specializations/${id}`, { 
            method: "DELETE" 
        });
        if (response.ok) {
            console.log("Elemento eliminado");
            loadSpecializations();
        } else {
            throw new Error("Fallo al eliminar");
        }
    } catch (error) {
        console.log("ERROR: ", error);
    }
}

//- Editar 
async function editSpec(id) {
    let newName = prompt("Introduce el nuevo nombre");
    let newDescription = prompt("Introduce la nueva descripción");
    if (!newName || !newDescription) {
        alert("Datos no válidos");
        return;
    }

    try {
        let response = await fetch(`${URL}/specializations/${id}`, {
            method: "PUT",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({ name: newName, description: newDescription })
        });
        if (response.ok) {
            console.log("Elemento actualizado");
            loadSpecializations();
        } else {
            let resData = await response.json();
            throw new Error(resData.error || "Fallo al actualizar");
        }
    } catch (error) {
        console.log("ERROR: ", error);
    }
}

// ====== Mostrar ======
async function showSpec(id) {
    try {
        let response = await fetch(`${URL}/specializations/${id}`);
        if (response.ok) {
            let spec = await response.json();
            alert(`Nombre: ${spec.name}\nDescripción: ${spec.description}`);
        } else {
            let resData = await response.json();
            alert(resData.error);
            throw new Error(resData.error);
        }
    } catch (error) {
        console.log("ERROR: ", error);
    }
}

// ====== Cargar al inicio ======
loadSpecializations();


