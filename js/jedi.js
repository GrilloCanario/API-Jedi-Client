const URL = "http://localhost:3030";

const form = document.getElementById("Formulario");
const nameInput = document.getElementById('jediName');
const speciesInput = document.getElementById('jediSpecies');
const rankContainer = document.getElementById('rankContainer');
const styleFormContainer = document.getElementById('styleFormContainer');
const specializationContainer = document.getElementById('specializationContainer');
const jedisContainer = document.getElementById("jedisContainer");
const successMessage = document.getElementById("successMessage")

///*- INICIO FORMULARIO -*
//- Crear Jedi
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const selectedRank = rankContainer.querySelector("input[type=radio]:checked");
    const selectedStyles = Array.from(
        styleFormContainer.querySelectorAll("input[type=checkbox]:checked")
    );
    const selectedSpecs = Array.from(
        specializationContainer.querySelectorAll("input[type=checkbox]:checked")
    );

    if (!nameInput.value || !speciesInput.value || !selectedRank) {
        alert("Nombre, raza y rango son obligatorios");
        return;
    }

    const data = {
        name: nameInput.value,
        species: speciesInput.value,
        rank: [`${URL}/ranks/${selectedRank.value}`],
        styleForm: selectedStyles.map(cb => `${URL}/stylesForm/${cb.value}`),
        specialization: selectedSpecs.map(cb => `${URL}/specializations/${cb.value}`)
    };

    try {
        const res = await fetch(`${URL}/jedis`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        if (!res.ok) throw new Error("Fallo al crear Jedi");

        form.reset();
        successMessage.style.display = "block";
        setTimeout(() => successMessage.style.display = "none", 4000);
        loadJedis();
    } catch (error) {
        console.error("ERROR:", error);
    }
});

//- Cargar opciones -/
async function loadOptions() {
    try {
        const [ranks, styles, specs] = await Promise.all([
            fetch(`${URL}/ranks`).then(r => r.json()),
            fetch(`${URL}/stylesForm`).then(r => r.json()),
            fetch(`${URL}/specializations`).then(r => r.json())
        ]);

        ranks.forEach(rank => {
            rankContainer.innerHTML += `
                <label>
                    <input type="radio" name="rank" value="${rank.id}"> ${rank.name}
                </label><br>
            `;
        });

        styles.forEach(style => {
            styleFormContainer.innerHTML += `
                <label>
                    <input type="checkbox" value="${style.id}"> ${style.name}
                </label><br>
            `;
        });

        specs.forEach(spec => {
            specializationContainer.innerHTML += `
                <label>
                    <input type="checkbox" value="${spec.id}"> ${spec.name}
                </label><br>
            `;
        });
    } catch (error) {
        console.error("ERROR cargando opciones:", error);
    }
}

//- Listado de Jedis -/
async function loadJedis() {
    try {
        jedisContainer.innerHTML = "";
        const res = await fetch(`${URL}/jedis`);
        if (!res.ok) throw new Error("Error al cargar jedis");

        const jedis = await res.json();
        jedis.forEach(insertJediCard);
    } catch (error) {
        console.error("ERROR:", error);
    }
}

function insertJediCard(jedi) {
    const card = document.createElement("div");
    card.classList.add("jedi-card");

    card.innerHTML = `
        <h3>${jedi.name}</h3>
        <button class="delete" data-id="${jedi.id}">Borrar</button>
        <button class="edit" data-id="${jedi.id}">Editar</button>
        <button class="show" data-id="${jedi.id}">Mostrar</button>
    `;

    jedisContainer.appendChild(card);
}

jedisContainer.addEventListener("click", (e) => {
    const id = e.target.dataset.id;
    if (!id) return;

    if (e.target.classList.contains("delete")) deleteJedi(id);
    if (e.target.classList.contains("edit")) window.location.href = `editJedi.html?id=${id}`;
    if (e.target.classList.contains("show")) showJedi(id);
});

async function deleteJedi(id) {
    try {
        await fetch(`${URL}/jedis/${id}`, { 
            method: "DELETE"
        });
        loadJedis();
    } catch (error) {
        console.error("ERROR:", error);
    }
}

//- Mostrar Jedi -/
async function showJedi(id) {
    try {
        const res = await fetch(`${URL}/jedis/${id}`);
        const jedi = await res.json();

        const rankNames = [];
        if (jedi.rank) {
            for (const rankUrl of jedi.rank) {
                const res = await fetch(rankUrl);
                if (res.ok) {
                    const rank = await res.json();
                    rankNames.push(rank.name);
                }
            }
        }

        // ===== Formas de combate =====
        const styleNames = [];
        if (jedi.styleForm) {
            for (const styleUrl of jedi.styleForm) {
                const res = await fetch(styleUrl);
                if (res.ok) {
                    const style = await res.json();
                    styleNames.push(style.name);
                }
            }
        }

        // ===== Especializaciones =====
        const specNames = [];
        if (jedi.specialization) {
            for (const specUrl of jedi.specialization) {
                const res = await fetch(specUrl);
                if (res.ok) {
                    const spec = await res.json();
                    specNames.push(spec.name);
                }
            }
        }

        alert(`Nombre: ${jedi.name}
Especie: ${jedi.species}
Rango: ${rankNames.join(", ")}
Formas de combate: ${styleNames.join(", ")}
Especializaciones: ${specNames.join(", ")}
`);
    } catch (error) {
        console.error("ERROR:", error);
    }
}

loadOptions();
loadJedis();
