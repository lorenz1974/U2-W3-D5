// ***********************************************************************//
// FUNCTIONS DEFINITIONS
//
// ***********************************************************************
//

// esegue il fect delle API
const fetchFunction = async (fetchUrl, method, headersObj, bodyObject) => {
    try {
        // Debug...
        _D(1, `fetching: ${fetchUrl}`);

        let fetchObj = {};

        // GET e DELETE non hanno body
        if (method === 'GET' || method === 'DELETE') {
            fetchObj = {
                method: method,
                headers: new Headers(headersObj),
            };
        } else {
            fetchObj = {
                method: method,
                headers: new Headers(headersObj),
                body: JSON.stringify(bodyObject),
            };
        }

        // Lancia il fetch
        const response = await fetch(fetchUrl, fetchObj);

        if (!response.ok) {
            throw new Error('Errore nella response dal server!');
        }

        // Restituisce il risultato parsato come JSON
        const responseJSON = await response.json();
        _D(3, responseJSON, 'fetchFunction - responseJSON')

        return responseJSON;

    } catch (error) {
        // Gestione degli errori
        sendAnAlert(`fetchFunction - Errore nel fetching dei dati: ${error.message}`, 'danger')
        throw new Error('Errore durante il recupero dei dati del fetch');
    }
}



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


const applySearchFilter = async () => {
    try {
        // Esegui il fetch
        apiItemsArray = await fetchFunction(fetchUrl, method, headersObj, bodyObject);
        _D(3, apiItemsArray, 'applySearchFilter - apiItemsArray');

    } catch (error) {
        // Gestione degli errori nel fetching
        sendAnAlert(`applySearchFilter - Errore durante il fetch dei dati: ${error.message}`, 'danger');
        throw new Error('Errore durante il recupero dei dati con l\'operazione di fetching.');
    }

    // Recupera il parametro di ricerca
    const search = getUrlParam('search');
    _D(1, `search: ${search}`);

    // Converte il termine di ricerca in minuscolo se esiste
    const searchLower = search ? search.toLowerCase() : '';

    // Verifica se la ricerca estesa è attiva
    const extensiveSearch = getUrlParam('extensiveSearch') === '1';

    // Applica il filtro
    apiItemsArray = apiItemsArray.filter((item) => {
        // Controlla se il termine di ricerca corrisponde a uno dei campi
        const matchesSearch = !search || (
            item._id.includes(search) ||
            item.name.toLowerCase().includes(searchLower) ||
            item.brand.toLowerCase().includes(searchLower) ||
            item.description.toLowerCase().includes(searchLower)
        );

        // Controlla se il brand non include "user"
        const excludesUserBrand = !item.brand.toLowerCase().includes('user');

        // Filtra in base alla modalità di ricerca
        return extensiveSearch ? matchesSearch : matchesSearch && excludesUserBrand;
    });

    // Aggiorna il campo di ricerca per migliorare la UX
    if (search) {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = search;
        }
    }
};


// Funzione che manda messaggi all'utente
const sendAnAlert = (message, level) => {
    document.getElementById('alertMessage').innerHTML = message
    document.getElementById('alertMessage').classList.add(`alert-${level}`)
    document.getElementById('alertMessage').classList.toggle('d-none')
}


// Disattiva tutti i placeHolders. Serve per non doverli cercare uno via id
const switchOffPlaceholders = () => {
    Array.from(document.getElementsByClassName('waitPlaceholder')).forEach((waitPlaceholder) => {
        waitPlaceholder.classList.add('d-none');
    });
};


//
// ***********************************************************************
//
// VARIABLE DEFINITIONS
//
// ***********************************************************************
//

debugLevel = 3


//
// ***********************************************************************
//
// MAIN ROUTINE
//
// ***********************************************************************
//

// Funzione che attacca l'eventListener al form di ricerca
document.getElementById('searchDiv').addEventListener('submit', (e) => {
    e.preventDefault()
})