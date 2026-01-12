const URL = "http://localhost:3030";

const styleFormContainer = document.getElementById('styleFormContainer');
const combatForm = document.getElementById('CombatForm');
const combatName = document.getElementById('CombatName');
const styleCombat = document.getElementById('styleCombat');

// ====== Cargar todas las formas de combate ======
async function loadStyleForm() {
    try {
        styleFormContainer.textContent = "";
        let response = await fetch(`${URL}/stylesForm`);
        if (response.ok) {
            let stylesForm = await response.json();
            stylesForm.forEach(style => insertStyleFormCard(style));
        } else {
            throw new Error('Fallo al cargar las formas de combate');
        }
    } catch (error) {
        console.log("ERROR: ", error);
    }
}

// ====== Insertar tarjeta ======
function insertStyleFormCard(style) {
    const card = document.createElement('div');
    card.classList.add('styleForm-card');

    card.innerHTML = `
        <h3>${style.name}</h3>
        <button class="delete" data-id="${style.id}">Borrar</button>
        <button class="edit" data-id="${style.id}">Editar</button>
        <button class="show" data-id="${style.id}">Mostrar</button>
    `;

    styleFormContainer.append(card);
}

// ====== Eventos sobre las tarjetas ======
styleFormContainer.addEventListener('click', async (event) => {
    const id = event.target.dataset.id;
    if (!id) return;

    if (event.target.classList.contains('delete')) await deleteStyleForm(id);
    if (event.target.classList.contains('edit')) await editStyleForm(id);
    if (event.target.classList.contains('show')) await showStyleForm(id);
});

// ====== Eliminar ======
async function deleteStyleForm(id) {
    try {
        let response = await fetch(`${URL}/stylesForm/${id}`, { method: "DELETE" });
        if (response.ok) {
            console.log("Elemento eliminado");
            loadStyleForm();
        } else {
            throw new Error("Fallo al eliminar");
        }
    } catch (error) {
        console.log("ERROR: ", error);
    }
}

// ====== Crear ======
combatForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = {
        name: combatName.value,
        description: styleCombat.value
    };

    if (!data.name || !data.description) {
        alert("Nombre y descripción obligatorios");
        return;
    }

    try {
        let response = await fetch(`${URL}/stylesForm`, {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(data)
        });
        if (response.ok) {
            console.log("Elemento creado");
            combatName.value = "";
            styleCombat.value = "";
            loadStyleForm();
        } else {
            let resData = await response.json();
            throw new Error(resData.error || "Fallo al crear");
        }
    } catch (error) {
        console.log("ERROR: ", error);
    }
});

// ====== Editar ======
async function editStyleForm(id) {
    let newName = prompt("Introduce el nuevo nombre");
    let newDescription = prompt("Introduce la nueva descripción");
    if (!newName || !newDescription) {
        alert("Datos no válidos");
        return;
    }

    try {
        let response = await fetch(`${URL}/stylesForm/${id}`, {
            method: "PUT",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({ name: newName, description: newDescription })
        });
        if (response.ok) {
            console.log("Elemento actualizado");
            loadStyleForm();
        } else {
            let resData = await response.json();
            throw new Error(resData.error || "Fallo al actualizar");
        }
    } catch (error) {
        console.log("ERROR: ", error);
    }
}

// ====== Mostrar ======
async function showStyleForm(id) {
    try {
        let response = await fetch(`${URL}/stylesForm/${id}`);
        if (response.ok) {
            let style = await response.json();
            alert(`Nombre: ${style.name}\nDescripción: ${style.description}`);
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
loadStyleForm();