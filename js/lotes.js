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

    //console.log(lotes)
    mostrarLotes(lotes);
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

const contenedor=document.getElementById('contenedor-lote')
function mostrarLotes(lotes){
    lotes.forEach(lote=>{
        const card_lote=document.createElement('div')
        card_lote.setAttribute('class',"border rounded w-fit p-3 flex flex-col gap-y-2 bg-gray-200 shadow-lg hover:bg-gray-100 cursor-pointer")
        console.log(lote)
        card_lote.setAttribute('id','card_lote'+lote.id_lote)
        card_lote.innerHTML=`
            <div class=" ">
                <h3 class="text-center">${lote.nombre}</h3>
                <img  class=" rounded" width="250" height="250" src="https://img.freepik.com/foto-gratis/delimitacion-terreno-bosque_23-2149721838.jpg" alt="">
            </div>
            <div class="">
                <p>${lote.departamento.toUpperCase()} - ${lote.direccion} </p>
                <p class="text-md"> <span> Superficie: </span>${lote.superficie}</p>
                <p class="text-md"><span>Cantidad de Terrenos:</span>${lote.cant_terrenos}</p>
                <p class="text-md"><span>Disponibles:</span> ${lote.disponibles}</p>
            </div>
            `
            card_lote.addEventListener('click',()=>{
                console.log(lote.id_lote)
                limpiar()
            })
            contenedor.appendChild(card_lote)

        })
    
}
function limpiar(){

    contenedor.innerHTML=''
}
