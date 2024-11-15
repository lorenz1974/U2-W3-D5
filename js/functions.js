// ***********************************************************************//
// FUNCTIONS DEFINITIONS
//
// ***********************************************************************
//

// esegue il fect delle API
const fetchFunction = async (fetchUrl, method, headersObj, bodyObject) => {

    // Debug...
    _D(1, `fetching: ${fetchUrl}`)

    let fetchObj = {}

    // GET e DELETE non hanno boby
    if (method === 'GET' || method === 'DELETE') {
        fetchObj = {
            method: method,
            headers: new Headers(headersObj),
        }
    } else {
        fetchObj = {
            method: method,
            headers: new Headers(headersObj),
            body: JSON.stringify(bodyObject),
        }
    }

    // Lancia il fetch
    return fetch(fetchUrl, fetchObj)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Errore nella response dal server!');
            }
            return response.json(); // Restituisce un array se la risposta è un array
        })
        .catch((error) => {
            console.error('Errore nella fetchFunction:', error);
            throw error; // Rilancia l'errore per gestirlo all'esterno
        });
};


// Ricerca un parametro dell'URL
const getUrlParam = (param) => {
    const urlParams = new URLSearchParams(window.location.search)
    paramValue = urlParams.get(param)
    _D(2, `url param '${param}': ${paramValue}`)
    return paramValue
}


// Disegna HEADER e FOOTER su tutte le pagine
const drawHeaderAndFooter = () => {

    headerHTML = `
        <nav class="navbar sticky-top navbar-expand-lg bg-body-secondary">
            <div class="container-fluid">
                <a class="navbar-brand" href="#">CRUDAZON Shop</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                    aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav">
                        <li class="nav-item">
                            <a class="nav-link active" aria-current="page" href="/index.html">Home</a>
                        </li>
        `

    // Se l'utente è autenticato metto il link al backend
    if (parseInt(getUrlParam('userAuthenticated')) === 1) {
        headerHTML += `
                        <li class="nav-item">
                            <a class="nav-link" href="/backend.html?userAuthenticated=1">Backend</a>
                        </li>
        `
    }

    headerHTML += `
                        <li class="nav-item">
                            <a class="nav-link disabled" href="#">Chart</a>
                        </li>
                    </ul>
                </div>
                `
    if (!getUrlParam('userAuthenticated')) {
        headerHTML += `
                <a href="/index.html?userAuthenticated=1" class="border border-1 rounded px-3 py-2 text-primary d-inline-flex align-items-center text-decoration-none">
                    <i class="fa-solid fa-user me-2"></i>
                    Log In
                </a>
        `
    } else if (parseInt(getUrlParam('userAuthenticated')) === 1) {
        headerHTML += `
                <a href="/index.html" class="border border-1 rounded px-3 py-2 text-primary d-inline-flex align-items-center text-decoration-none">
                    <i class="fa-solid fa-user me-2"></i>
                    Log Off
                </a>
        `
    }

    headerHTML += `
            </div>
        </nav>
        `
    document.getElementsByTagName('header')[0].innerHTML = headerHTML
}

//
// ***********************************************************************
//
// VARIABLE DEFINITIONS
//
// ***********************************************************************
//

// let fetchUrl = 'https://striveschool-api.herokuapp.com/api/product/';
// let method = 'GET';
// let headersObj = {
//     'Content-Type': 'application/json',
//     'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzM3MDYyMDhhZDEyOTAwMTU4NzZiYzEiLCJpYXQiOjE3MzE2NTkyOTcsImV4cCI6MTczMjg2ODg5N30.jEpwONMXP3MP7pYQrrV_JAv-QZWy3LHpV6EI5_vNywc'
// };
// let bodyObject = { key: 'value' };
// let apiResultArray;

//debugLevel = 3


//
// ***********************************************************************
//
// MAIN ROUTINE
//
// ***********************************************************************
//

// fetchFunction(fetchUrl, method, headersObj, bodyObject)
//     .then((result) => {
//         resultArray = result; // Assegna l'array alla variabile
//         console.log('Array ricevuto:', resultArray);

//         // Esempio di utilizzo dell'array
//         if (Array.isArray(resultArray)) {
//             resultArray.forEach(item => console.log(item));
//         } else {
//             console.warn('La risposta non è un array.');
//         }
//     })
//     .catch((error) => {
//         console.error('Errore nella chiamata:', error);
//     });