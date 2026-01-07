const URL = "http://localhost:3030";

const jedisContainer = document.getElementById('jedisContainer');
const jediForm = document.getElementById('jediForm');
const jediName = document.getElementById('jediName');
const jediSpecie = document.getElementById('jediSpecie');

//- Cargar Jedis -/
async function loadJedis() {
    try {
        jedisContainer.textContent = "";
        let response = await fetch(`${URL}/jedis`);
        if (response.ok) {
            let jedis = await response.json();
            //console.log(jedis);
            jedis.forEach(jedi => {
                insertJediCard(jedi)
            });
        } else {
            throw new Error('Fallo al cargar los datos')
        }
    } catch (error) {
        console.log("ERROR: ", error)
    }
}

function insertJediCard(jedi) {
    const card = document.createElement('div');
    card.classList.add('jedi-card');

    card.innerHTML = `
        <h3>${jedi.name}</h3>
        <p><strong>Especie:</strong> ${jedi.species}</p>
        <button class="delete" data-id="${jedi.id}">Borrar</button>
        <button class="edit" data-id="${jedi.id}">Editar</button>
        <button class="show" data-id="${jedi.id}">Mostrar</button>
    `;
    jedisContainer.append(card);
}

jedisContainer.addEventListener('click', (event) => {
    //const id = event.target.dataset.id;
    if (event.target.classList.contains('delete')) {
        deleteJedi(event.target.dataset.id);
    };
    if (event.target.classList.contains('edit')) {
        editJedi(event.target.dataset.id);
    };
    if (event.target.classList.contains('show')) {
        showJedi(event.target.dataset.id);
    };
})

async function deleteJedi(id) {
    try {
        let response = await fetch(`${URL}/jedis/${id}`, {
            method: "delete"
        });
        if (response.ok) {
            console.log('Elemento Eliminado');
            loadJedis();
        } else {
            throw new Error('Fallo al eliminar')
        }
    } catch (error) {
        console.log("ERROR: ", error)
    }
}

jediForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    let data = {
        name: jediName.value,
        species: jediSpecie.value
    }
    console.log("creando...", data);
    if (!data.name || !data.species) {
        alert("Nombre y especie obligatorios");
        return;
    }
    try {
        let response = await fetch(`${URL}/jedis`, {
            method: "POST",
            headers: {
                "Content-type": 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (response.ok) {
            console.log('Elemento creado');
            jediName.value = "";
            jediSpecie.value = "";
            loadJedis();
        } else {
            if (response.status == 400) {
                let data = await response.json();
                throw new Error('400 - Fallo en los datos. ' + data.error);
            }
            throw new Error('Fallo al crear');
        }
    } catch (error) {
        console.log("ERROR: ", error)
    }
});

async function editJedi(id) {
    let newName = prompt('Introduce el nuevo nombre');
    let newSpecies = prompt('Introduce la nueva especie');
    if (!newName || !newSpecies) {
        alert("Datos no válidos");
        return;
    }
    console.log("Nombre: %s, Especie: %s", newName, newSpecies);

    try {
        let response = await fetch(`${URL}/jedis/${id}`, {
            method: "PUT",
            headers: {
                "Content-type": 'application/json'
            },
            body: JSON.stringify({
                name: newName,
                species: newSpecies
            })
        });
        if (response.ok) {
            console.log('Elemento actualizado');
            loadJedis();
        } else {
            throw new Error('Fallo al atualizar')
        }
    } catch (error) {
        console.log("ERROR: ", error)
    }
}

async function showJedi(id) {
    try {
        let response = await fetch(`${URL}/jedis/${id}`);
        if (response.ok) {
            let jedi = await response.json();
            alert(`Nombre: ${jedi.name}, Especie: ${jedi.species}`);
        } else {
            if (response.status == 404) {
                let data = await response.json();
                alert(data.error);
                loadJedis();
                throw new Error(data.error);
            }
            throw new Error('Fallo al mostrar')
        }
    } catch (error) {
        console.log("ERROR: ", error)
    }
}

loadJedis();
