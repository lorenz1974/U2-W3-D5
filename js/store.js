// ***********************************************************************//
// FUNCTIONS DEFINITIONS
//
// ***********************************************************************
//


// Disegna l'albim delle foto
const drawAlbum = (htmReturn) => {

    // Svuoto l'album
    !htmReturn ? document.getElementById('cardsDiv').innerHTML = '' : {}

    // Eseguo il loop sullì'array delel card
    apiItemsArray.forEach((apiItem, index) => {

        const newCol = document.createElement('div')
        _D(2, `creating card for: ${apiItem._id} - ${apiItem.name}`)

        newCol.classList.add('col-md-4')
        newCol.innerHTML = `
                <div id="card-${apiItem._id}" class="card mb-4 shadow-sm">
                    <img
                        id="image-${apiItem._id}"
                        src="${apiItem.imageUrl}"
                        class="bd-placeholder-img card-img-top img-fluid"
                        data-bs-toggle="modal" data-bs-target="#imageModal"
                    />
                    <div class="card-body">
                        <p class="card-text text-capitalize">
                            <a class="text-decoration-none text-secondary" href="/index.html?search=${apiItem.brand}">${apiItem.brand}</a>
                        </p>
                        <h5 id="cardTitle-${apiItem._id}" class="card-title">${apiItem.name}</h5>
                        <!--
                            ${apiItem.description}
                        </p>
                        -->
                        <p id="cardPrice-${apiItem._id}" class="card-text text-end fs-4 fw-bold mt-3">
                            ${apiItem.price.toFixed(2)} &euro;
                        </p>
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="btn-group">
                                <button
                                    id="view-${apiItem._id}"
                                    type="button"
                                    class="btn btn-sm btn-outline-secondary"
                                    Data-bs-toggle="modal" data-bs-target="#imageModal">

                                    View
                                </button>
                                <!--
                                <button id="remove-${apiItem._id}" type="button" class="btn btn-sm btn-outline-secondary">
                                    Hide
                                </button>
                                -->
                            </div>
                            <!--
                            <small class="text-muted">
                                ${apiItem.brand}
                            </small>
                            -->
                        </div>
                    </div>
                </div>
                `

        _D(3, `card HTML: ${newCol.innerHTML}`)

        document.getElementById('cardsDiv').appendChild(newCol)
    })
}


// Funzione che costruisce il body del modale
const drawModal = async (modalId) => {

    const itemsDetails = await fetchFunction(fetchUrl + '/' + modalId, 'GET', headersObj)
    _D(3, itemsDetails, 'itemsDetails')


    // Setto il titolo
    document.getElementById('modalTitle').innerHTML = `${itemsDetails.name}`

    // Setto il body del modale
    document.getElementById('modalBody').innerHTML = `
        <img width="200px" src="${itemsDetails.imageUrl}" class="img-fluid">
        <div class="w-50 mx-auto mt-2 text-start">
        <p class="m-0 p-0"><span class="fw-bold">Category:</span> <span class="">${itemsDetails.brand} </span></p>
            <p class="m-0 mt-3 p-0"><span class="fw-bold">Description:</span></p>
            <p><span class=""> ${itemsDetails.description}</span></p>
            <p class="mt-3 p-0"><span class="fw-bold">Price:</span></p>
            <div class="d-flex justify-content-center align-items-center">
                <span class="fw-bold fs-4">${itemsDetails.price.toFixed(2)} &euro;</span>
                <button id="buy-${itemsDetails._id}" class="btn btn-danger ms-2 p-0 py-1 px-2">Buy It! (not yet active)</button>
            </div>
        </div>
    `;

    //document.getElementById('imageModal').style.backgroundColor = photoArray.avg_color
};

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
let search = ''


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
    usersAutenticated = getUrlParam('usersAutenticated')


    // Disegno header e footer
    drawHeaderAndFooter()

    // Eseguo il fetch
    apiItemsArray = await fetchFunction(fetchUrl, method, headersObj, bodyObject)
    _D(2, apiItemsArray, 'apiItemsArray')

    search = getUrlParam('search')
    _D(1, `search: ${search}`)

    apiItemsArray = search ? apiItemsArray.filter((item) => item.brand === search) : apiItemsArray

    // Disegno l'album ddei prodotti
    drawAlbum()



    // Event listener al click sul body
    document.getElementsByTagName('body')[0].addEventListener('click', (e) => {

        const target = e.target.id
        _D(3, `event is:`, e)

        const targetType = target.split('-')[0]
        _D(1, `targetType is: ${targetType}`)

        const targetId = target.split('-')[1]
        _D(1, `targetId is: ${targetId}`)

        switch (targetType) {
            case 'remove': {
                removeCard(targetId)
                break
            }
            case 'searchButton': {
                location.href = `./pexels-start.html?q=${document.getElementById('searchInput').value}`
                break
            }
            case 'image':
            case 'view': {
                drawModal(targetId)
            }
            default: { break }
        }
    })

})