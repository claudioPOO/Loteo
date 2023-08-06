/* exported gapiLoaded */
/* exported gisLoaded */
/* exported handleAuthClick */
/* exported handleSignoutClick */

// TODO(developer): Set to client ID and API key from the Developer Console
const CLIENT_ID = '804418091536-hk3l5oaalrm6i8ltqm7bchij56n2711d.apps.googleusercontent.com';
const API_KEY = 'AIzaSyCfgmxdbJDJ6qUeEqsyYoED6iyWqoW2uLE';

// Discovery doc URL for APIs used by the quickstart
const DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';

// Son los permisos que va a pedir nuestra aplicacion al loguernos con google
const SCOPES = 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/spreadsheets';


//Token que nos permite la comunicacion con google
let tokenClient;

//Son flags para saber si gapi y gis han arrancado
let gapiInited = false;
let gisInited = false;

document.getElementById("gapi").addEventListener('load', gapiLoaded)
document.getElementById("loadClient").addEventListener('load', gisLoaded)

//Se ocultan los botones de inicar sesion y cerrar sesion
document.getElementById('authorize_button').style.visibility = 'hidden';
document.getElementById('signout_button').style.visibility = 'hidden';




//Cuando se carga el gapi se ejecuta esta funcion
function gapiLoaded() {
    gapi.load('client', initializeGapiClient);
}

/**
 * Callback after the API client is loaded. Loads the
 * discovery doc to initialize the API.
 */
async function initializeGapiClient() {
    await gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: [DISCOVERY_DOC],
    });
    gapiInited = true;
    maybeEnableButtons();
}



//Cuando se carga el gis se ejecuta esta funcion
//INTERFACE PARA INICIAR SESION
function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: '', // defined later
    });
    gisInited = true;
    maybeEnableButtons();

    //Almacena token en el localstorage
    //localStorage.setItem('usuarioAutenticado', 'true')
    //localStorage.setItem('token', JSON.stringify(tokenClient))


}

//Cuando todo esta que es lo que podemos hacer
//EN ESTE CASO MUESTRA EL BOTON DE INICIAR SESION
function maybeEnableButtons() {
    if (gapiInited && gisInited) {
        document.getElementById('authorize_button').style.visibility = 'visible';
    }
}



//Se ejecuta cunado se hace click en el button de iniciar session
function handleAuthClick() {
    //window.location.href = '../html/lotes.html'
    tokenClient.callback = async (resp) => {
        if (resp.error !== undefined) {
            throw (resp);
        }
        //Si no hubo ningun error, se hace visible el boton de cerrar sesion
        //Y cambiar el button para iniciar sesion a refresh
        document.getElementById('signout_button').style.visibility = 'visible';
        document.getElementById('authorize_button').innerText = 'Refresh';

        //Redirige al usuario
        //window.location.href = '../html/lotes.html';

        await getLotes()
        //await listMajors();
        //await getUserProfile();
    };

    if (gapi.client.getToken() === null) {
        // Prompt the user to select a Google Account and ask for consent to share their data
        // when establishing a new session.
        tokenClient.requestAccessToken({prompt: 'consent'});
    } else {
        // Skip display of account chooser and consent dialog for an existing session.
        tokenClient.requestAccessToken({prompt: ''});
    } 
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick() {
const token = gapi.client.getToken();
    if (token !== null) {
        google.accounts.oauth2.revoke(token.access_token);
        gapi.client.setToken('');
        document.getElementById('content').innerText = '';
        document.getElementById('authorize_button').innerText = 'Authorize';
        document.getElementById('signout_button').style.visibility = 'hidden';
    }
}

/**
 * Print the names and majors of students in a sample spreadsheet:
 * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 */
async function listMajors() {

    //console.log(gapi.client)

    let response;
    try {
        // Fetch first 10 files
        response = await gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: '1oWd2Nr4qCsJ9sSMrUcEIenZ_0pphDMREbVbVlUx6Ph8',
        range: 'Lotes!A:H',
        });
    } catch (err) {
        console.error(err)
        //document.getElementById('content').innerText = err.message;
        return;
    }
    //Evalua la longitud de la response
    const range = response.result;
    if (!range || !range.values || range.values.length == 0) {
        //document.getElementById('content').innerText = 'No values found.';
        console.warn("No se encontraron valores")
        return;
    }
    // Muestra por pantalla
    console.log(range.values)
    console.log(convertToObjects(range.values))
    /* const output = range.values.reduce(
        (str, row) => `${str}${row[0]}, ${row[4]}\n`,
        'Name, Major:\n');
    document.getElementById('content').innerText = output;  */
}


function convertToObjects(arrayLotes){
    //Desglozar encabezado y registros
    const [encabezado, ...registros] = arrayLotes;

    //Recorro el arreglo de datos
    const result = registros.map( registro =>{
        //Por cada registro creo un objeto
        const obj = {};
        encabezado.forEach((element,index )=> {
            obj[element.toLowerCase()] = registro[index]
        });
        return obj;
    })

    return result;

}

async function getUserProfile() {
    try {
        // Verificar si gapi.client.people está definido antes de realizar la solicitud
        if (gapi.client.people) {
        const response = await gapi.client.people.people.get({
            resourceName: 'people/me',
            personFields: 'names,emailAddresses',
        });

        // La información del perfil del usuario está en response.result.
        const userProfile = response.result;
        console.log(userProfile);
        } else {
        console.error('API de People no está cargada o definida correctamente.');
        }
    } catch (err) {
        console.error('Error al obtener la información del perfil del usuario:', err);
    }
}
