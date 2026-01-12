const URL = "http://localhost:3030";

const form = document.getElementById('editJediForm');
const nameInput = document.getElementById('jediName');
const speciesInput = document.getElementById('jediSpecies');
const rankContainer = document.getElementById('rankContainer');
const styleFormContainer = document.getElementById('styleFormContainer');
const specializationContainer = document.getElementById('specializationContainer');
const successMessage = document.getElementById('successMessage');

const params = new URLSearchParams(window.location.search);
const jediId = params.get('id');

//- Cargar jedi
async function loadOptions() {
    try {
        // Rangos
        let resRanks = await fetch(`${URL}/ranks`);
        let ranks = await resRanks.json();
        ranks.forEach(rank => {
            const label = document.createElement('label');
            label.innerHTML = `<input type="radio" name="jediRank" value="${rank.id}"> ${rank.name}`;
            rankContainer.appendChild(label);
            rankContainer.appendChild(document.createElement('br'));
        });

        // Formas de combate
        let resStyles = await fetch(`${URL}/stylesForm`);
        let styles = await resStyles.json();
        styles.forEach(style => {
            const label = document.createElement('label');
            label.innerHTML = `<input type="checkbox" value="${style.id}"> ${style.name}`;
            styleFormContainer.appendChild(label);
            styleFormContainer.appendChild(document.createElement('br'));
        });

        // Especializaciones
        let resSpecs = await fetch(`${URL}/specializations`);
        let specs = await resSpecs.json();
        specs.forEach(spec => {
            const label = document.createElement('label');
            label.innerHTML = `<input type="checkbox" value="${spec.id}"> ${spec.name}`;
            specializationContainer.appendChild(label);
            specializationContainer.appendChild(document.createElement('br'));
        });

        // Aquí se resuelve la promesa para indicar que todo se ha cargado
        return Promise.resolve();
    } catch (error) {
        console.log("ERROR cargando opciones:", error);
        return Promise.reject(error);
    }
}

// ====== Cargar datos del Jedi ======
async function loadJediData() {
    try {
        let res = await fetch(`${URL}/jedis/${jediId}`);
        if (res.ok) {
            let jedi = await res.json();
            nameInput.value = jedi.name;
            speciesInput.value = jedi.species;

            // Marcar rango actual
            if (jedi.rank && jedi.rank.length > 0) {
                const rankId = jedi.rank[0].split("/").pop();
                const rb = rankContainer.querySelector(`input[value="${rankId}"]`);
                if (rb) rb.checked = true;
            }

            // Marcar formas de combate
            jedi.styleForm.forEach(url => {
                const id = url.split("/").pop();
                const cb = styleFormContainer.querySelector(`input[value="${id}"]`);
                if (cb) cb.checked = true;
            });

            // Marcar especializaciones
            jedi.specialization.forEach(url => {
                const id = url.split("/").pop();
                const cb = specializationContainer.querySelector(`input[value="${id}"]`);
                if (cb) cb.checked = true;
            });

        } else {
            console.log("Error al cargar Jedi");
        }
    } catch (error) {
        console.log("ERROR:", error);
    }
}

// ====== Cargar primero opciones y después datos del Jedi ======
(async () => {
    await loadOptions(); // Esperamos a que los checkboxes estén listos
    await loadJediData(); // Ahora sí marcamos correctamente los valores
})();
