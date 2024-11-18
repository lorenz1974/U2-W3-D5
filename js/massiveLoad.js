// ***********************************************************************//
// FUNCTIONS DEFINITIONS
//
// ***********************************************************************
//



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

// Contenitore dei risultati del fecth
let apiResultArray;

const debugLevel = 2;



//
// ***********************************************************************
//
// MAIN ROUTINE
//
// ***********************************************************************
//

// Cancella tutto
(async () => {
    try {
        const fetchUrl = 'https://striveschool-api.herokuapp.com/api/product/';
        // Chiamata API per ottenere l'array
        const apiResultArray = await fetchFunction(fetchUrl, 'GET', headersObj);

        _D(1, apiResultArray, 'apiResultArray');

        // Esegui un'operazione su ogni elemento dell'array
        // for (i = 0; i < apiResultArray.length; i++) {
        //     const postFetchUrl = 'https://striveschool-api.herokuapp.com/api/product/' + apiResultArray[i]._id;

        //     // Invio dei dati di ogni elemento a un'altra API
        //     const response = await fetchFunction(postFetchUrl, 'DELETE', headersObj);
        //     _D(3, `Dati inviati per l'item ${apiResultArray[i]._id}`, response);
        // }
    } catch (error) {
        console.error('Errore durante la chiamata API:', error);
    }
})();


// (async () => {
//     try {
//         const fetchUrl = 'https://fakestoreapi.com/products';
//         // Chiamata API per ottenere l'array
//         const apiResultArray = await fetchFunction(fetchUrl, 'GET', headersObj, bodyObject);

//         _D(3, apiResultArray);

//         // Esegui un'operazione su ogni elemento dell'array
//         for (const item of apiResultArray) {
//             const postFetchUrl = 'https://striveschool-api.herokuapp.com/api/product/';
//             const bodyObj = {
//                 'name': item.title,
//                 'description': item.description,
//                 'brand': item.category,
//                 'imageUrl': item.image,
//                 'price': item.price
//             }

//             //_W(body)
//             // Invio dei dati di ogni elemento a un'altra API
//             const response = await fetchFunction(postFetchUrl, 'POST', headersObj, bodyObj);
//             _D(3, `Dati inviati per l'item ${item.id}`, response);
//         }
//     } catch (error) {
//         console.error('Errore durante la chiamata API:', error);
//     }
// })();

// (async () => {
//     try {
//         const fetchUrl = 'https://dummyjson.com/products';
//         // Chiamata API per ottenere l'array
//         const apiResultArray = await fetchFunction(fetchUrl, 'GET', headersObj, bodyObject);

//         _D(3, 'apiResultArray', apiResultArray);

//         // Esegui un'operazione su ogni elemento dell'array
//         for (const item of apiResultArray.products) {
//             const postFetchUrl = 'https://striveschool-api.herokuapp.com/api/product/';
//             const bodyObj = {
//                 'name': item.title,
//                 'description': item.description,
//                 'brand': item.brand ? item.brand : item.category,
//                 'imageUrl': item.images[0],
//                 'price': item.price
//             }

//             //_W(bodyObj)
//             // Invio dei dati di ogni elemento a un'altra API
//             const response = await fetchFunction(postFetchUrl, 'POST', headersObj, bodyObj);
//             _D(3, `Dati inviati per l'item ${item.id}`, response);
//         }
//     } catch (error) {
//         console.error('Errore durante la chiamata API:', error);
//     }
// })();
