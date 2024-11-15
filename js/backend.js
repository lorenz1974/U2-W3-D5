// ***********************************************************************//
// FUNCTIONS DEFINITIONS
//
// ***********************************************************************
//

// Disegna l'albim delle foto
const drawProductsTable = (htmReturn) => {

    // Svuoto l'album
    !htmReturn ? document.getElementById('proctucsTableBody').innerHTML = '' : {}

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
                        <td class="text-end text-nowrap fw-bold">${apiItem.price.toFixed(2)} &euro;</td>
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
                    </tr>
                `

        _D(3, `tableBodyHTML: ${tableBodyHTML}`)

        document.getElementById('proctucsTableBody').innerHTML += tableBodyHTML
    })
}


// Disegno il modale per la conferma della cancellazione
const drawConfirmationModal = async (modalId, action) => {

    const itemsDetails = await fetchFunction(fetchUrl + '/' + modalId, 'GET', headersObj)
    _D(3, itemsDetails, 'itemsDetails')

    // Setto il titolo
    document.getElementById('deleteModalTitle').innerHTML = `CONFIRM DELETE ACTION`


    // Setto il body del modale
    document.getElementById('deleteModalBody').innerHTML = `
        <h3 class="text-center text-danger">THIS PRODUCT IS GOING TO BE DELETED</h1>
        <p class="m-0 mt-3 p-0"><span class="fw-bold">Name:</span> <span class="">${itemsDetails.name} </span></p>
        <p class="m-0 mt-3 p-0"><span class="fw-bold">Description:</span></p>
        <p><span class=""> ${itemsDetails.description}</span></p>
        <p class="m-0 p-0"><span class="fw-bold">Category:</span> <span class="">${itemsDetails.brand} </span></p>
            <p class="mt-3 p-0"><span class="fw-bold">Price:</span> <span class="fw-bold">${itemsDetails.price.toFixed(2)} &euro;</span></p>
        </div>
    `
    document.getElementById('deleteModalFooter').innerHTML = `
        <button id="deleteFromDatabase-${itemsDetails._id}" type="button" class="btn btn-danger" data-bs-dismiss="modal">DELETE</button>
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">CANCEL</button>
    `

    //document.getElementById('imageModal').style.backgroundColor = photoArray.avg_color
};


// Funzione che cancella il prodotto dal DB
const deleteFromDatabase = async (productId) => {
    _D(1, `Cancellazione del prodotto: ${productId}`)
    const apiResponse = await fetchFunction(fetchUrl + productId, 'DELETE', headersObj)
    _D(2, apiResponse, 'apiResponse')
}



// Disegno il modale per l'edit o l'inserimento
const drawEditModal = async (modalId, action) => {

    // In caso di Edit viene passato un modalId preso dalla tabella prodotti
    // In caso di creazione no e quindi genero un oggetto fittizio per non dover cambiare il codice
    let itemsDetails = {}
    if (modalId) {
        itemsDetails = await fetchFunction(fetchUrl + '/' + modalId, 'GET', headersObj)
        _D(3, itemsDetails, 'itemsDetails')
    } else {
        itemsDetails = {
            '_id': '',
            'name': '',
            'description': '',
            'brand': '',
            'imageUrl': '',
            'price': 0
        }
    }

    document.getElementById('editModalTitle').innerHTML = `CREATE/MODIFY A PRODUCT`

    // Setto il body del modale
    document.getElementById('editModalBody').innerHTML = `
            <div class="form-floating mb-3">
                <input type="text" class="form-control" id="floatingId" placeholder="name" value="${itemsDetails._id}" disabled>
                <label for="floatingId">Product ID</label>
            </div>

            <div class="form-floating mb-3">
                <input type="text" class="form-control" id="floatingName" placeholder="name" value="${itemsDetails.name}" required>
                <label for="floatingName">Product name</label>
                    <div class="invalid-feedback">
                        Please insert the product name.
                    </div>
            </div>

            <div class="form-floating mb-3">
                <textarea
                    rows="10"
                    class="form-control h-100"
                    id="floatingDescription"
                    placeholder="Description"
                    required>${itemsDetails.description}</textarea>
                <label for="floatingDescription">Description</label>
            </div>

            <div class="form-floating mb-3">
                <input type="text" class="form-control" id="floatingBrand" placeholder="Brand" value="${itemsDetails.brand}" required>
                <label for="floatingBrand">Brand</label>
            </div>


            <div class="form-floating mb-3">
                <input type="text" class="form-control" id="floatingImageUrl" placeholder="ImageUrl" value="${itemsDetails.imageUrl}" required>
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
    `
    document.getElementById('editModalFooter').innerHTML = `
        <button type="submit" data-mdb-button-init data-mdb-ripple-init
            id="${modalId ? 'updateInDatabase' : 'createInDatabase'}-${itemsDetails._id}"
            class="btn btn-danger">
             ${modalId ? 'UPDATE' : 'CREATE'}
        </button>
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">CANCEL</button>
    `
};

const manageInDatabase = async () => {

    const productId = document.getElementById('floatingId').value.trim()

    const itemsDetails = {
        'name': document.getElementById('floatingName').value.trim(),
        'description': document.getElementById('floatingDescription').value.trim(),
        'brand': document.getElementById('floatingBrand').value.trim(),
        'imageUrl': document.getElementById('floatingImageUrl').value.trim(),
        'price': document.getElementById('floatingPrice').value.trim(),
    }

    if (productId !== '') {
        _D(1, `Aggiornamento del prodotto: ${productId}`)
        _D(2, itemsDetails)
        const apiResponse = await fetchFunction(fetchUrl + productId, 'PUT', headersObj, itemsDetails)
        _D(2, apiResponse, 'apiResponse')
    }
    else {
        _D(1, `Inserimento del prodotto: ${itemsDetails.name}`)
        _D(2, itemsDetails)
        const apiResponse = await fetchFunction(fetchUrl, 'POST', headersObj, itemsDetails)
        _D(2, apiResponse, 'apiResponse')
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
let apiResultArray;

let usersAutenticated = 0


debugLevel = 2

//
// ***********************************************************************
//
// MAIN ROUTINE
//
// ***********************************************************************
//

document.addEventListener('DOMContentLoaded', async () => {

    _D(1, 'DOM Loaded')

    // Determino se l'utente è autenticato
    // al momento non c'è routine di autenticazione ma mi predispongo
    // se non è autenticato lo rimando in home
    parseInt(getUrlParam('usersAutenticated')) !== 1 && debugLevel < 2 ? window.location.assign('/index.html') : {}


    // Disegno header e footer
    drawHeaderAndFooter()

    // Eseguo il fetch
    apiItemsArray = await fetchFunction(fetchUrl, method, headersObj, bodyObject)
    _D(2, apiItemsArray, 'apiItemsArray')

    // Disegno la tabella dei prodotti
    drawProductsTable()

    // Event listener al click sul body
    document.getElementsByTagName('body')[0].addEventListener('click', async (e) => {

        const target = e.target.id
        _D(3, `event is:`, e)

        const targetType = target.split('-')[0]
        _D(1, `targetType is: ${targetType}`)

        const targetId = target.split('-')[1]
        _D(1, `targetId is: ${targetId}`)

        switch (targetType) {
            case 'removeFromProductsTable': {
                drawConfirmationModal(targetId, 'removeFromProductsTable')
                break
            }

            case 'editFromProductsTable': {
                _W('editFromProductsTable')
                drawEditModal(targetId, 'editFromProductsTable')

                break

            }
            case 'deleteFromDatabase': {
                // Cancello il target dal DB
                deleteFromDatabase(targetId)

                //Ricarico gli items dal catalogo
                apiItemsArray = await fetchFunction(fetchUrl, method, headersObj, bodyObject)

                //Ridisegno la tabella prodotti
                drawProductsTable()

                break
            }

            default: { break }
        }
    })

    document.getElementById('editModalForm').addEventListener('submit', async (e) => {
        // Disattivo il comportamento standard del form
        e.preventDefault()

        _D(1, `updateForm seubmitted`)

        // Aggiorno il target dal DB
        apiItemsArray = await manageInDatabase()

        //Ricarico tutta la pagina
        window.location.reload()
    })


})