let lotes = [];


async function getLotes(){

    //console.log("Entro a la funcion")

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

    lotes = convertToObjects(range.values);

    console.log(lotes)
    
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