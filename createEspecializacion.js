const URL = "http://localhost:3030";

const form = document.getElementById("createSpecializationForm");
const nameInput = document.getElementById("specName");
const descInput = document.getElementById("specDescription");
const successMessage = document.getElementById("successMessage");

// ====== Crear especialización ======
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!nameInput.value || !descInput.value) {
        alert("El nombre  y descripción son obligatorios");
        return;
    }

    const data = {
        name: nameInput.value,
        description: descInput.value
    };

    try {
        let response = await fetch(`${URL}/specializations`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            nameInput.value = "";
            descInput.value = "";

            successMessage.style.display = "block";
            setTimeout(() => {
                successMessage.style.display = "none";
            }, 5000);
        } else {
            let err = await response.json();
            throw new Error(err.error || "Error al crear la especialización");
        }
    } catch (error) {
        console.log("ERROR:", error);
    }
});

