const URL = "http://localhost:3030";

const form = document.getElementById('editJediForm');
const nameInput = document.getElementById('jediName');
const speciesInput = document.getElementById('jediSpecies');
const rankContainer = document.getElementById('rankContainer');
const styleFormContainer = document.getElementById('styleFormContainer');
const specializationContainer = document.getElementById('specializationContainer');
const successMessage = document.getElementById('successMessage');

const params = new URLSearchParams(window.location.search);
const id = params.get('id');

//- Cargar jedi
async function loadOptions() {
    try {
        // Rangos
        const resRanks = await fetch(`${URL}/ranks`);
        const ranks = await resRanks.json();
        ranks.forEach(rank => {
            rankContainer.insertAdjacentHTML(
                "beforeend",
                `<label>
                    <input type="radio" name="rank" value="${rank.id}"> ${rank.name}
                 </label><br>`
            );
        });

        // Formas de combate
        const resStyles = await fetch(`${URL}/stylesForm`);
        const styles = await resStyles.json();
        styles.forEach(style => {
            styleFormContainer.insertAdjacentHTML(
                "beforeend",
                `<label>
                    <input type="checkbox" value="${style.id}"> ${style.name}
                 </label><br>`
            );
        });

        // Especializaciones
        const resSpecs = await fetch(`${URL}/specializations`);
        const specs = await resSpecs.json();
        specs.forEach(spec => {
            specializationContainer.insertAdjacentHTML(
                "beforeend",
                `<label>
                    <input type="checkbox" value="${spec.id}"> ${spec.name}
                 </label><br>`
            );
        });

    } catch (error) {
        console.log("ERROR cargando opciones:", error);
    }
}

// ====== Cargar Jedi ======
async function loadJediData() {
    try {
        const res = await fetch(`${URL}/jedis/${id}`);
        if (!res.ok) throw new Error("No se pudo cargar el Jedi");

        const jedi = await res.json();
        nameInput.value = jedi.name;
        speciesInput.value = jedi.species;

        // Rango
        if (jedi.rank?.length) {
            const rankId = jedi.rank[0].split("/").pop();
            rankContainer.querySelector(`input[value="${rankId}"]`)?.click();
        }

        // Formas de combate
        jedi.styleForm?.forEach(url => {
            const id = url.split("/").pop();
            styleFormContainer.querySelector(`input[value="${id}"]`)?.click();
        });

        // Especializaciones
        jedi.specialization?.forEach(url => {
            const id = url.split("/").pop();
            specializationContainer.querySelector(`input[value="${id}"]`)?.click();
        });

    } catch (error) {
        console.log("ERROR:", error);
    }
}

// ====== Guardar cambios ======
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const selectedRank = rankContainer.querySelector('input[type=radio]:checked');
    if (!selectedRank) {
        alert("Debes seleccionar un rango Jedi");
        return;
    }

    const styles = Array.from(
        styleFormContainer.querySelectorAll('input[type=checkbox]:checked')
    ).map(cb => `${URL}/stylesForm/${cb.value}`);

    const specs = Array.from(
        specializationContainer.querySelectorAll('input[type=checkbox]:checked')
    ).map(cb => `${URL}/specializations/${cb.value}`);

    const data = {
        name: nameInput.value,
        species: speciesInput.value,
        rank: [`${URL}/ranks/${selectedRank.value}`],
        styleForm: styles,
        specialization: specs
    };

    try {
        const res = await fetch(`${URL}/jedis/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        if (res.ok) {
            successMessage.style.display = "block";
            setTimeout(() => successMessage.style.display = "none", 4000);
        } else {
            throw new Error("Error al actualizar Jedi");
        }

    } catch (error) {
        console.log("ERROR:", error);
    }
});

// ====== Init ======
(async () => {
    await loadOptions();
    await loadJediData();
})();
