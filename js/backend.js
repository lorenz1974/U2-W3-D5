// ***********************************************************************//
// FUNCTIONS DEFINITIONS
//
// ***********************************************************************
//

// Disegna l'albim delle foto
const drawProductsTable = (htmReturn = false) => {

    // Svuoto l'album
    if (!htmReturn) {
        document.getElementById('proctucsTableBody').innerHTML = ''
    }

    // Eseguo il loop sullì'array delel card
    apiItemsArray.forEach((apiItem, index) => {

        _D(2, `creating row for: ${apiItem._id} - ${apiItem.name}`)

        tableBodyHTML = `

                    <tr>
                        <td>${index + 1}</td>
                        <td>
                            <img
                            width="50px"
                            id="productTableImage-${apiItem._id}"
                            src="${apiItem.imageUrl}"
                            />
                        </td>
                        <td class="text-capitalize">${apiItem.brand}</td>
                        <td class="productsTableName">${apiItem.name}</td>
                        <td class="productsTableDescription">${apiItem.description}</td>
                        <td class="text-end text-nowrap fw-bold">${apiItem.price.toFixed(2)}</td>
                        <td class="productsTableRemove text-center">
                            <i id="removeFromProductsTable-${apiItem._id}" class="fa-regular fa-trash-can"
                             data-bs-toggle="modal" data-bs-target="#deleteConfirmationModal">
                            </i>
                        </td>
                        <td class="productsTableEdit text-center">
                            <i id="editFromProductsTable-${apiItem._id}" class="fa-solid fa-pencil"
                             data-bs-toggle="modal" data-bs-target="#editModal">
                            </i>
                        </td>
                        <td class="productsTableView">
                            <a href="/index.html?search=${apiItem._id}"
                                class="text-dark"
                                >
                                <i class="fa-solid fa-eye"></i>
                            </a>
                        </td>
                    </tr>
                `

        _D(3, `tableBodyHTML: ${tableBodyHTML}`)

        // Disattivo il placeholder
        switchOffPlaceholders();

        // Sparo la tabella
        document.getElementById('proctucsTableBody').innerHTML += tableBodyHTML
    })
}


// Disegno il modale per la conferma della cancellazione
const drawConfirmationModal = (modalId) => {
    try {
        // Recupera i dettagli dell'elemento tramite fetch
        const itemsDetails = fetchFunction(`${fetchUrl}/${modalId}`, 'GET', headersObj);
        _D(2, itemsDetails, 'itemsDetails');

    } catch (error) {
        // Gestione errori
        sendAnAlert(`drawConfirmationModal - Errore nel caricamento del modale: ${error.message}`, 'danger');
        throw new Error('Errore nel caricamento del modale')
    }

    // Disattivo il placeholder
    switchOffPlaceholders();


    // Setta il titolo del modale
    const modalTitle = document.getElementById('deleteModalTitle');
    if (modalTitle) {
        modalTitle.innerHTML = `CONFIRM DELETE ACTION`;
    }

    // Setta il body del modale
    const modalBody = document.getElementById('deleteModalBody');
    if (modalBody) {
        modalBody.innerHTML = `
                <h3 class="text-center text-danger">THIS PRODUCT IS GOING TO BE DELETED</h3>
                <p class="m-0 mt-3 p-0"><span class="fw-bold">Name:</span> ${itemsDetails.name}</p>
                <p class="m-0 mt-3 p-0"><span class="fw-bold">Description:</span></p>
                <p>${itemsDetails.description}</p>
                <p class="m-0 p-0"><span class="fw-bold">Category:</span> ${itemsDetails.brand}</p>
                <p class="mt-3 p-0"><span class="fw-bold">Price:</span> <span class="fw-bold">${itemsDetails.price.toFixed(2)} &euro;</span></p>
            `;
    }

    // Setta il footer del modale
    const modalFooter = document.getElementById('deleteModalFooter');
    if (modalFooter) {
        modalFooter.innerHTML = `
                <button id="deleteFromDatabase-${itemsDetails._id}" type="button" class="btn btn-danger" data-bs-dismiss="modal">DELETE</button>
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">CANCEL</button>
            `;
    }
}



// Funzione che cancella il prodotto dal DB
const deleteFromDatabase = async (productId) => {
    _D(1, `Cancellazione del prodotto: ${productId}`)
    try {
        const apiResponse = await fetchFunction(fetchUrl + productId, 'DELETE', headersObj)
        _D(2, apiResponse, 'apiResponse')
    } catch (error) {
        // Gestione errori
        sendAnAlert(`deleteFromDatabase - Errore nella cancellazione del prodotto: ${error.message}`, 'danger');
        throw new Error('Errore nella cancellazione del prodotto')
    }

}



// Disegno il modale per l'edit o l'inserimento
const drawEditModal = async (modalId) => {
    let itemsDetails = {
        '_id': '',
        'name': '',
        'description': '',
        'brand': '',
        'imageUrl': '',
        'price': 0
    };

    // Se viene passato un modalId, tenta di recuperare i dati
    if (modalId) {
        try {
            itemsDetails = await fetchFunction(`${fetchUrl}/${modalId}`, 'GET', headersObj);
            _D(3, itemsDetails, 'drawEditModal - itemsDetails');
        } catch (error) {
            sendAnAlert(`drawEditModal - Errore nel recupero dei dati: ${error.message}`, 'danger');
            throw new Error('Errore durante il recupero dei dati per il modale'); // Segnala chiaramente l'errore
        }
    }

    // Disattivo il placeholder
    switchOffPlaceholders();

    // Disegna il modale (con i dati recuperati o con l'oggetto fittizio)
    document.getElementById('editModalTitle').innerHTML = `CREATE/MODIFY A PRODUCT`;

    document.getElementById('editModalBody').innerHTML = `
        <div class="form-floating mb-3">
            <input type="text" class="form-control" id="floatingId" placeholder="name" value="${itemsDetails._id}" disabled>
            <label for="floatingId">Product ID</label>
        </div>
        <div class="form-floating mb-3">
            <input type="text" class="form-control" id="floatingName" placeholder="name" value="${itemsDetails.name}" required>
            <label for="floatingName">Product name</label>
            <div class="invalid-feedback">Please insert the product name.</div>
        </div>
        <div class="form-floating mb-3">
            <textarea
                rows="10"
                class="form-control h-100"
                id="floatingDescription"
                placeholder="Description"
                required>${itemsDetails.description.replace(/<br\s*\/?>/g, '\r\n')}</textarea>
            <label for="floatingDescription">Description</label>
        </div>
        <div class="form-floating mb-3">
            <input type="text" class="form-control" id="floatingBrand" placeholder="Brand" value="${itemsDetails.brand}" required>
            <label for="floatingBrand">Brand</label>
        </div>
        <div class="form-floating mb-3">
            <input type="url" class="form-control" id="floatingImageUrl" placeholder="ImageUrl" value="${itemsDetails.imageUrl}" required>
            <label for="floatingImageUrl">Insert the product image URL</label>
        </div>
        <div class="form-floating mb-3">
            <input type="number" min="0" step="0.01"
                class="form-control"
                id="floatingPrice"
                placeholder="Price"
                value="${itemsDetails.price}"
                required
            >
            <label for="floatingPrice">Price in Euro &euro;</label>
        </div>
    `;

    document.getElementById('editModalFooter').innerHTML = `
        <button type="submit" data-mdb-button-init data-mdb-ripple-init
            id="${modalId ? 'updateInDatabase' : 'createInDatabase'}-${itemsDetails._id}"
            class="btn btn-danger">
            ${modalId ? 'UPDATE' : 'CREATE'}
        </button>
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">CANCEL</button>
    `;
};


const manageInDatabase = async () => {

    const productId = document.getElementById('floatingId').value.trim()

    const itemsDetails = {
        'name': document.getElementById('floatingName').value.trim(),
        'description': document.getElementById('floatingDescription').value.trim().replace(/\r?\n/g, '<br />'),
        'brand': document.getElementById('floatingBrand').value.trim(),
        'imageUrl': document.getElementById('floatingImageUrl').value.trim(),
        'price': document.getElementById('floatingPrice').value.trim(),
    }

    // Se non c'è il productId vuol dire che il modale è stato popolato per la creazione e non la modifica
    if (productId !== '') {

        _D(1, `Aggiornamento del prodotto: ${productId}`)
        _D(2, itemsDetails)

        try {
            const apiResponse = fetchFunction(fetchUrl + productId, 'PUT', headersObj, itemsDetails)
            _D(2, apiResponse, 'apiResponse')

        } catch (error) {
            // Gestione errori
            sendAnAlert(`manageInDatabase - Errore nella aggiornamento del prodotto: ${error.message}`, 'danger');
            throw new Error('Errore nella aggiornamento del prodotto')
        }
    }
    else {

        _D(1, `Inserimento del prodotto: ${itemsDetails.name}`)
        _D(2, itemsDetails)

        try {
            const apiResponse = fetchFunction(fetchUrl, 'POST', headersObj, itemsDetails)
            _D(2, apiResponse, 'apiResponse')

        } catch (error) {
            // Gestione errori
            sendAnAlert(`manageInDatabase - Errore nella creazione del prodotto: ${error.message}`, 'danger');
            throw new Error('Errore nella creazione del prodotto')
        }
    }

}

//
// ***********************************************************************
//
// VARIABLE DEFINITIONS
//
// ***********************************************************************
//


let fetchUrl = 'https://striveschool-api.herokuapp.com/api/product/';
let method = 'GET';
let headersObj = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzM3MDYyMDhhZDEyOTAwMTU4NzZiYzEiLCJpYXQiOjE3MzE2NTkyOTcsImV4cCI6MTczMjg2ODg5N30.jEpwONMXP3MP7pYQrrV_JAv-QZWy3LHpV6EI5_vNywc'
};
let bodyObject = { key: 'value' };
let apiItemsArray = []
let usersAutenticated = 0

// debugLevel = 3 // Definito in function.js

//
// ***********************************************************************
//
// MAIN ROUTINE
//
// ***********************************************************************
//

document.addEventListener('DOMContentLoaded', async () => {
    _D(1, 'DOM Loaded');

    // Determino se l'utente è autenticato
    if (!userAutentication('check') && debugLevel < 2) {
        window.location.assign('/index.html');
        return;
    }

    // Disegno header e footer
    drawHeaderAndFooter();


    // Verifica se è richiesto l'editing di qualche scheda e nel caso la apre simulando un click sull'icona dell'edit
    const editId = getUrlParam('editId');
    _D(2, `editId: ${editId}`);
    if (editId) {
        drawEditModal(editId)
        //editModalForm
        const modal = new bootstrap.Modal(document.getElementById('editModal'), {})
        modal.show();
        _D(2, 'body.addEventListener - modal.show()', modal)
    }


    // Esegue la fetch e applica la ricerca sull'array dei dati
    try {
        await applySearchFilter();
        _D(3, apiItemsArray, 'body.addEventListener - apiItemsArray');
    } catch (error) {
        sendAnAlert(`DOMContentLoaded - Errore durante il caricamento iniziale: ${error.message}`, 'danger');
        throw new Error('Errore durante il caricamento iniziale');
    }

    // Disattivo il placeholder
    switchOffPlaceholders();

    // Verifica e gestisce i prodotti
    if (apiItemsArray.length === 0) {
        sendAnAlert('No products found', 'warning');
        // Disattivo la tabella
        document.getElementById('productsTable').classList.add('d-none');
    } else {
        // Disegno la tabella prodotti
        drawProductsTable();
    }

    // Event listener al click sul body
    document.getElementsByTagName('body')[0].addEventListener('click', async (e) => {
        const target = e.target.id;
        _D(3, `event is:`, e);

        const targetType = target.split('-')[0];
        _D(1, `targetType is: ${targetType}`);

        const targetId = target.split('-')[1];
        _D(1, `targetId is: ${targetId}`);

        switch (targetType) {
            case 'removeFromProductsTable': {
                drawConfirmationModal(targetId, 'removeFromProductsTable');
                break;
            }

            case 'editFromProductsTable': {
                _W('editFromProductsTable');
                drawEditModal(targetId, 'editFromProductsTable');
                break;
            }

            case 'deleteFromDatabase': {
                try {
                    // Cancello il target dal DB
                    await deleteFromDatabase(targetId);
                } catch (error) {
                    sendAnAlert(`Errore durante la cancellazione del prodotto: ${error.message}`, 'danger');
                    throw new Error('Errore durante la cancellazione del prodotto')
                }

                // Ricarico gli items dal catalogo
                apiItemsArray = await fetchFunction(fetchUrl, method, headersObj, bodyObject);

                // Ridisegno la tabella prodotti
                drawProductsTable();


                break;
            }

            case 'searchButton': {
                const searchValue = document.getElementById('searchInput').value;
                location.href = `${location.origin}${location.pathname}?search=${encodeURIComponent(searchValue)}`;
                break;
            }

            default:
                break;
        }
    });


    // Attacca l'evento al modale della modifica
    document.getElementById('editModalForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        _D(1, `updateForm submitted`);

        try {
            // Forzo la chiusura del modale
            document.getElementById('modalEditCloseButton').click();

            // Aggiorno il target nel DB
            await manageInDatabase();

            // Ricarico l'array dei prodotti
            apiItemsArray = await fetchFunction(fetchUrl, method, headersObj, bodyObject);

            // Ridisegno la tabella
            drawProductsTable();
        } catch (error) {
            sendAnAlert(`Errore durante l'aggiornamento dei dati: ${error.message}`, 'danger');
        }
    });

    // Attacca l'evento al click sull'intestazione della colonna della tabella prodotti
    document.querySelector('#productsTable thead').addEventListener('click', (e) => {
        _D(1, `requested table sorting: ${e.target.tagName} - ${e.target.innerText}`);

        if (e.target.tagName === 'TD') {
            sortTable(e.target);
        }
    });
});
