const URL = "http://localhost:3030";

const form = document.getElementById('createJediForm');
const nameInput = document.getElementById('jediName');
const rankContainer = document.getElementById('rankContainer');
const speciesInput = document.getElementById('jediSpecies');
const styleFormContainer = document.getElementById('styleFormContainer');
const specializationContainer = document.getElementById('specializationContainer');
const successMessage = document.getElementById('successMessage');

async function loadOptions() {
    try {
        //- Selección del rango
        let resRanks = await fetch(`${URL}/ranks`);
        if (resRanks.ok) {
            let ranks = await resRanks.json();
            ranks.forEach(rank => {
                const label = document.createElement('label');
                label.innerHTML = `
                    <input type="radio" name="rank" value="${rank.id}"> ${rank.name}
                `;
                rankContainer.appendChild(label);
                rankContainer.appendChild(document.createElement('br'));
            });
        }

        //- Selección de las Formas de Combate
        let resStyles = await fetch(`${URL}/stylesForm`);
        if (resStyles.ok) {
            let styles = await resStyles.json();
            styles.forEach(style => {
                const label = document.createElement('label');
                label.innerHTML = `
                    <input type="checkbox" value="${style.id}"> ${style.name}
                `;
                styleFormContainer.appendChild(label);
                styleFormContainer.appendChild(document.createElement('br'));
            });
        }

        //- Selección de las Especializaciones
        let resSpecs = await fetch(`${URL}/specializations`);
        if (resSpecs.ok) {
            let specs = await resSpecs.json();
            specs.forEach(spec => {
                const label = document.createElement('label');
                label.innerHTML = `
                    <input type="checkbox" value="${spec.id}"> ${spec.name}
                `;
                specializationContainer.appendChild(label);
                specializationContainer.appendChild(document.createElement('br'));
            });
        }

    } catch (error) {
        console.log("ERROR cargando opciones:", error);
    }
}

//- Crear Jedi
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!nameInput.value || !speciesInput.value) {
        alert("Nombre y especie obligatorios");
        return;
    }

    // ====== Estilos seleccionados ======
    const selectedStyles = Array.from(
        styleFormContainer.querySelectorAll('input[type=checkbox]:checked')
    ).map(cb => `${URL}/stylesForm/${cb.value}`);

    // ====== Especializaciones seleccionadas ======
    const selectedSpecs = Array.from(
        specializationContainer.querySelectorAll('input[type=checkbox]:checked')
    ).map(cb => `${URL}/specializations/${cb.value}`);

    // ====== Rango seleccionado (UNO) ======
    const selectedRank = rankContainer.querySelector('input[type=radio]:checked');
    if (!selectedRank) {
        alert("Debes seleccionar un rango Jedi");
        return;
    }

    const data = {
        name: nameInput.value,
        species: speciesInput.value,
        rank: [`${URL}/ranks/${selectedRank.value}`],
        styleForm: selectedStyles,
        specialization: selectedSpecs
    };

    try {
        let res = await fetch(`${URL}/jedis`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        if (res.ok) {
            form.reset();

            // Mensaje de éxito temporal
            successMessage.style.display = "block";
            setTimeout(() => {
                successMessage.style.display = "none";
            }, 5000);
        } else {
            let errData = await res.json();
            throw new Error(errData.error || "Fallo al crear Jedi");
        }
    } catch (error) {
        console.log("ERROR creando Jedi:", error);
    }
});

loadOptions();
