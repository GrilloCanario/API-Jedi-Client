const URL = "http://localhost:3030";

const form = document.getElementById("Formulario");
const nameInput = document.getElementById("SpecName");
const descInput = document.getElementById("specDescription");
const successMessage = document.getElementById("successMessage");
const specContainer = document.getElementById("specializationsContainer");

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
        const response = await fetch(`${URL}/specializations`, {
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

            loadSpecializations();
        } else {
            const err = await response.json();
            throw new Error(err.error || "Error al crear la especialización");
        }
    } catch (error) {
        console.error("ERROR:", error);
    }
});

//- Cargar especializaciones -/
async function loadSpecializations() {
    try {
        specContainer.innerHTML = "";
        const response = await fetch(`${URL}/specializations`);
        
        if (!response.ok) {
            throw new Error("Fallo al cargar especializaciones");
        }

        const specs = await response.json();
        specs.forEach(insertSpecCard);
    } catch (error) {
        console.error("ERROR:", error);
    }
}

//- Crear tarjeta -/
function insertSpecCard(spec) {
    const card = document.createElement("div");
    card.classList.add("spec-card");

    card.innerHTML = `
        <h3>${spec.name}</h3>
        <p><strong>Descripción:</strong> ${spec.description}</p>
        <button class="delete" data-id="${spec.id}">Borrar</button>
        <button class="edit" data-id="${spec.id}">Editar</button>
    `;

    specContainer.appendChild(card);
}

//- Eventos sobre las tarjetas -/
specContainer.addEventListener("click", async (event) => {
    const id = event.target.dataset.id;
    if (!id) return;

    if (event.target.classList.contains("delete")) {
        await deleteSpec(id);
    }

    if (event.target.classList.contains("edit")) {
        window.location.href = `editEspecializacion.html?id=${id}`;
    }
});

//- Eliminar -/
async function deleteSpec(id) {
    try {
        const response = await fetch(`${URL}/specializations/${id}`, {
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

loadSpecializations();