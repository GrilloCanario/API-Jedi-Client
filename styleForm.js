const URL = "http://localhost:3030";

const styleFormContainer = document.getElementById('styleFormContainer');

async function loadStyleForm() {
    try {
        styleFormContainer.textContent = "";
        let response = await fetch(`${URL}/stylesForm`);
        if (response.ok) {
            let stylesForm = await response.json();
            //console.log(stylesForm);
            stylesForm.forEach(styleForm => {
                insertStyleFormCard(styleForm)
            });
        } else {
            throw new Error('Fallo al cargar los datos')
        }
    } catch (error) {
        console.log("ERROR: ", error)
    }
}

function insertStyleFormCard(styleForm) {
    const card = document.createElement('div');
    card.classList.add('styleForm-card');

    card.innerHTML = `
        <h3>${styleForm.name}</h3>
    `;
    styleFormContainer.append(card);
}

// styleFormContainer.addEventListener('click', (event) => {
//     //const id = event.target.dataset.id;
//     if (event.target.classList.contains('delete')) {
//         deleteJedi(event.target.dataset.id);
//     };
//     if (event.target.classList.contains('edit')) {
//         editJedi(event.target.dataset.id);
//     };
//     if (event.target.classList.contains('show')) {
//         showJedi(event.target.dataset.id);
//     };
// })



loadStyleForm();