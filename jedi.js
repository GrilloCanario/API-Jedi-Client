const URL = "http://localhost:3030";
const jedisList = document.getElementById('jedisList');
const jediForm = document.getElementById('jediForm');
const jediName = document.getElementById('jediName');
const jediSpecie = document.getElementById('jediSpecie');

async function loadJedis() {
    try {
        jedisList.textContent = "";
        let response = await fetch(`${URL}/jedis`);
        if (response.ok) {
            let jedis = await response.json();
            //console.log(jedis);
            jedis.forEach(jedi => {
                insertJedi(jedi)
            });
        } else {
            throw new Error('Fallo al cargar los datos')
        }
    } catch (error) {
        console.log("ERROR: ", error)
    }
}

function insertJedi(jedi) {
    const li = document.createElement('li');
    li.textContent = jedi.name;
    const buttonDelete = document.createElement('button');
    buttonDelete.textContent = "Borrar";
    buttonDelete.classList.add('delete');
    buttonDelete.dataset.id = jedi.id;
    li.append(buttonDelete);
    const buttonEdit = document.createElement('button');
    buttonEdit.textContent = "Editar";
    buttonEdit.classList.add('edit');
    buttonEdit.dataset.id = jedi.id;
    li.append(buttonEdit);
    const buttonView = document.createElement('button');
    buttonView.textContent = "Mostrar";
    buttonView.classList.add('show');
    buttonView.dataset.id = jedi.id;
    li.append(buttonView);
    jedisList.append(li);
}

jedisList.addEventListener('click', (event) => {
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
    let data = {
        name: newName,
        species: newSpecies
    }
    try {
        let response = await fetch(`${URL}/jedis/${id}`, {
            method: "PUT",
            headers: {
                "Content-type": 'application/json'
            },
            body: JSON.stringify(data)
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
            alert(jedi.name);
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