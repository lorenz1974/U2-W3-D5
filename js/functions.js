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

    // GET e DELETE non hanno body
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
    const urlParams = new URLSearchParams(window.location.search);
    const paramValue = urlParams.get(param);
    _D(2, `url param '${param}': ${paramValue}`);
    return paramValue ? paramValue.trim() : null;
};



// Disegna HEADER e FOOTER su tutte le pagine
const drawHeaderAndFooter = () => {

    headerHTML = `
        <nav class="navbar navbar-expand-lg bg-body-secondary">
            <div class="container-fluid">
                <a class="navbar-brand" href="#">CRUDAZON Shop</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                    aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav">
                        <li class="nav-item">
                            <a class="nav-link active"
                                aria-current="page"
                                href="/index.html">
                                    Home
                            </a>
                        </li>
        `

    // Se l'utente è autenticato metto il link al backend
    if (userAutentication('check')) {
        headerHTML += `
                        <li class="nav-item">
                            <a class="nav-link" href="/backend.html">Backend</a>
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
    if (!userAutentication('check')) {
        headerHTML += `
                <a id="loginButton" onclick="userAutentication('logon')" href="" class="border border-1 rounded px-3 py-2 text-primary d-inline-flex align-items-center text-decoration-none">
                    <i class="fa-solid fa-user me-2"></i>
                    Log In
                </a>
        `
    } else if (userAutentication('check')) {
        headerHTML += `
                <a id="loginButton" onclick="userAutentication('logoff')" href="/index.html" class="border border-1 rounded px-3 py-2 text-primary d-inline-flex align-items-center text-decoration-none">
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


// Action può essere:
// - 'check' per controllare l'autenticazione
// - 'logon' per autenticare l'utente
// - 'logoff' per deautenticare l'utente
const userAutentication = (action) => {
    switch (action) {
        case 'check': {
            const isAuthenticated = sessionStorage.getItem('isAuthenticated')
            if (parseInt(isAuthenticated) === 1) {
                return true
            } else {
                return false
            }
        }
        case 'logon': {
            sessionStorage.setItem('isAuthenticated', 1)
            return true
        }
        case 'logoff': {
            sessionStorage.setItem('isAuthenticated', '')
            return true
        }
        default: {
            return false
        }
    }
}


// Funzione per ordinare la tabella
const sortTable = (header) => {
    const table = header.closest("table");
    const columnIndex = Array.from(header.parentNode.children).indexOf(header); // Indice della colonna
    const rows = Array.from(table.querySelectorAll("tbody tr")); // Righe del corpo della tabella

    // Ottieni la direzione corrente o imposta "asc" come predefinita
    const currentOrder = header.dataset.sortOrder || "asc";
    const isAscending = currentOrder === "asc";

    // Ordina le righe in base al contenuto della colonna
    rows.sort((rowA, rowB) => {
        const cellA = rowA.children[columnIndex].textContent.trim();
        const cellB = rowB.children[columnIndex].textContent.trim();

        // Determina se il contenuto è numerico
        const isNumeric = !isNaN(cellA) && !isNaN(cellB);

        if (isNumeric) {
            // Ordina numeri
            return isAscending
                ? parseFloat(cellA) - parseFloat(cellB)
                : parseFloat(cellB) - parseFloat(cellA);
        } else {
            // Ordina testo
            return isAscending
                ? cellA.toLowerCase().localeCompare(cellB.toLowerCase())
                : cellB.toLowerCase().localeCompare(cellA.toLowerCase());
        }
    });

    // Aggiorna l'ordine delle righe nella tabella
    rows.forEach(row => table.querySelector("tbody").appendChild(row));

    // Inverti l'ordine per il prossimo clic
    header.dataset.sortOrder = isAscending ? "desc" : "asc";

    // Resetta gli altri header
    table.querySelectorAll("th").forEach(th => {
        if (th !== header) {
            delete th.dataset.sortOrder;
        }
    });
}


// Funzione che attacca l'eventListener al form di ricerca
document.getElementById('searchDiv').addEventListener('submit', (e) => {
    e.preventDefault()
})


const applySearchFilter = async () => {

    // Filtro l'array se c'è una ricerca generica dal form di ricerca
    search = getUrlParam('search')
    _D(1, `search: ${search}`)

    // Eseguo il fetch
    apiItemsArray = await fetchFunction(fetchUrl, method, headersObj, bodyObject)
    _D(2, apiItemsArray, 'apiItemsArray')

    // Filtro i record in base al parametro di ricerca
    // La ricesca estesa permette di ricercare anche gli 'users'
    if (getUrlParam('extensiveSearch') !== '1') {
        apiItemsArray = search
            ? apiItemsArray.filter((item) =>
                (item._id.includes(search) ||
                    item.brand.toLowerCase().includes(search.toLowerCase()) ||
                    item.description.toLowerCase().includes(search.toLowerCase())
                ) && !item.brand.toLowerCase().includes('user')
            )
            : apiItemsArray.filter((item) =>
                !item.brand.toLowerCase().includes('user')
            )
    } else {
        apiItemsArray = search
            ? apiItemsArray.filter(
                (item) =>
                    item._id.includes(search) ||
                    item.brand.toLowerCase().includes(search.toLowerCase()) ||
                    item.description.toLowerCase().includes(search.toLowerCase())
            )
            : apiItemsArray;

    }

    // Popolo l'input field della ricerca così che l'utente si accorga che c'è una
    // ricerca in corso (per una miglior UX)
    search ? document.getElementById('searchInput').value = search : {}
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