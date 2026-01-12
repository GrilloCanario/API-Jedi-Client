const URL = "http://localhost:3030";

const jedisContainer = document.getElementById('jedisContainer');
const jediForm = document.getElementById('jediForm');

//- Cargar Jedis -/
async function loadJedis() {
    try {
        jedisContainer.textContent = "";
        let response = await fetch(`${URL}/jedis`);
        if (response.ok) {
            let jedis = await response.json();
            jedis.forEach(jedi => {
                insertJediCard(jedi);
            });
        } else {
            throw new Error('Fallo al cargar los datos');
        }
    } catch (error) {
        console.log("ERROR: ", error);
    }
}

function insertJediCard(jedi) {
    const card = document.createElement('div');
    card.classList.add('jedi-card');

    card.innerHTML = `
        <h3>${jedi.name}</h3>
        <button class="delete" data-id="${jedi.id}">Borrar</button>
        <button class="edit" data-id="${jedi.id}">Editar</button>
        <button class="show" data-id="${jedi.id}">Mostrar</button>
    `;
    jedisContainer.append(card);
}

jedisContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('delete')) {
        deleteJedi(event.target.dataset.id);
    }

    if (event.target.classList.contains('edit')) {
        editJedi(event.target.dataset.id);
    }

    if (event.target.classList.contains('show')) {
        showJedi(event.target.dataset.id);
    }
});

async function deleteJedi(id) {
    try {
        let response = await fetch(`${URL}/jedis/${id}`, {
            method: "DELETE"
        });
        if (response.ok) {
            loadJedis();
        } else {
            throw new Error('Fallo al eliminar');
        }
    } catch (error) {
        console.log("ERROR: ", error);
    }
}

//- Reedirigir al fichero EditJedi.html
function editJedi(id) {
    window.location.href = `editJedi.html?id=${id}`;
}

async function showJedi(id) {
    try {
        let response = await fetch(`${URL}/jedis/${id}`);
        if (response.ok) {
            let jedi = await response.json();

            let rankNames = [];
            if (jedi.rank) {
                for (let rankUrl of jedi.rank) {
                    let resRank = await fetch(rankUrl);
                    if (resRank.ok) {
                        let rankData = await resRank.json();
                        rankNames.push(rankData.name);
                    }
                }
            }

            let styleNames = [];
            if (jedi.styleForm) {
                for (let styleUrl of jedi.styleForm) {
                    let resStyle = await fetch(styleUrl);
                    if (resStyle.ok) {
                        let styleData = await resStyle.json();
                        styleNames.push(styleData.name);
                    }
                }
            }

            let specNames = [];
            if (jedi.specialization) {
                for (let specUrl of jedi.specialization) {
                    let resSpec = await fetch(specUrl);
                    if (resSpec.ok) {
                        let specData = await resSpec.json();
                        specNames.push(specData.name);
                    }
                }
            }

            alert(`Nombre: ${jedi.name}
Especie: ${jedi.species}
Rango: ${rankNames.join(", ")}
Formas de Combate: ${styleNames.join(", ")}
Especializaciones: ${specNames.join(", ")}`);

        } else {
            throw new Error('Fallo al mostrar');
        }
    } catch (error) {
        console.log("ERROR: ", error);
    }
}

loadJedis();
