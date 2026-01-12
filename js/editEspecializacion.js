const URL = "http://localhost:3030";

// Obtener ID desde la URL
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const form = document.getElementById("editEspecializationForm");
const nameInput = document.getElementById("specName");
const descInput = document.getElementById("specDescription");
const successMessage = document.getElementById("successMessage");

// ====== Cargar especialización ======
async function loadSpecialization() {
    if (!id) {
        alert("ID de especialización no válido");
        return;
    }

    try {
        let response = await fetch(`${URL}/specializations/${id}`);
        if (response.ok) {
            let spec = await response.json();
            nameInput.value = spec.name;
            descInput.value = spec.description;
        } else {
            throw new Error("No se pudo cargar la especialización");
        }
    } catch (error) {
        console.log("ERROR:", error);
    }
}

// ====== Guardar cambios ======
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!id) {
        alert("ID inválido. Error al actualizar");
        return;
    }

    if (!nameInput.value || !descInput.value) {
        alert("Nombre y descripción son obligatorios");
        return;
    }

    const data = {
        name: nameInput.value,
        description: descInput.value
    };

    try {
        let response = await fetch(`${URL}/specializations/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            successMessage.style.display = "block";
            setTimeout(() => {
                successMessage.style.display = "none";
            }, 5000);
        } else {
            let err = await response.json();
            throw new Error(err.error || "Error al actualizar");
        }
    } catch (error) {
        console.log("ERROR:", error);
    }
});

loadSpecialization();
