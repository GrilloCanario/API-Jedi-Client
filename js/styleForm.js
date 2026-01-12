const URL = "http://localhost:3030";

const form = document.getElementById("Formulario");
const nameInput = document.getElementById("StyName");
const descInput = document.getElementById("StyDescription");
const successMessage = document.getElementById("successMessage");
const styleFormContainer = document.getElementById('styleFormContainer');

//- Crear especialización -/
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!nameInput.value || !descInput.value) {
        alert("El nombre y la descripción son obligatorios");
        return;
    }

    const data = {
        name: nameInput.value,
        description: descInput.value
    };

    try {
        const response = await fetch(`${URL}/stylesForm`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            form.reset();
            successMessage.style.display = "block";

            setTimeout(() => {
                successMessage.style.display = "none";
            }, 4000);

            loadStyleForm();
        } else {
            const err = await response.json();
            throw new Error(err.error || "Error al crear el estilo de combate");
        }
    } catch (error) {
        console.error("ERROR:", error);
    }
});


//- Cargar formas de combate -/
async function loadStyleForm() {
    try {
        styleFormContainer.textContent = "";
        const response = await fetch(`${URL}/stylesForm`);
        if (response.ok) {
            let stylesForm = await response.json();
            stylesForm.forEach(insertStyleFormCard);
        } else {
            throw new Error('Fallo al cargar las formas de combate');
        }
    } catch (error) {
        console.log("ERROR: ", error);
    }
}

//- Insertar tarjeta -/
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

//- Eventos sobre las tarjetas -/
styleFormContainer.addEventListener('click', async (event) => {
    const id = event.target.dataset.id;
    if (!id) return;

    if (event.target.classList.contains('delete')) {
        await deleteStyleForm(id)
    }

    if (event.target.classList.contains("edit")) {
        window.location.href = `editStyleForm.html?id=${id}`;
    }
    if (event.target.classList.contains('show')) await showStyleForm(id);
});

//- Eliminar -/
async function deleteStyleForm(id) {
    try {
        let response = await fetch(`${URL}/stylesForm/${id}`, { 
            method: "DELETE" 
        });
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

//- Mostrar -/
async function showStyleForm(id) {
    try {
        const response = await fetch(`${URL}/stylesForm/${id}`);
        if (!response.ok) throw new Error("No se pudo cargar la forma de combate");

        const style = await response.json();
        alert(`Nombre: ${style.name}\nDescripción: ${style.description}`);
    } catch (error) {
        console.error("ERROR:", error);
    }
}

//- Cargar al inicio -/
loadStyleForm();