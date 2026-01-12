const URL = "http://localhost:3030";

const ranksContainer = document.getElementById('ranksContainer');

// Cargar todos los rangos
async function loadRanks() {
    try {
        ranksContainer.textContent = "";
        let response = await fetch(`${URL}/ranks`);
        if (response.ok) {
            let ranks = await response.json();
            ranks.forEach(rank => insertRankCard(rank));
        } else {
            throw new Error('Fallo al cargar los rangos');
        }
    } catch (error) {
        console.log("ERROR: ", error);
    }
}

//  Insertar tarjeta
function insertRankCard(rank) {
    const card = document.createElement('div');
    card.classList.add('styleForm-card'); // reutilizamos la misma clase CSS de style.css

    card.innerHTML = `
        <h3>${rank.name}</h3>
    `;

    ranksContainer.append(card);
}

// Cargar al inicio 
loadRanks();