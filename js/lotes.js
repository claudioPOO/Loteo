//SECCION PRINCIPAL
const container=document.getElementById('body-dashboard')

//ARREGLO DE LOTES
var lotes = [];

//ARREGLO DE SOCIOS
var socios = []

//ARREGLO DE PORCENTAJES
var porcentajes = []


//ARREGLO DE TERRENOS
var terrenos = []

//ARREGLO DE CLIENTES
var clientes = []

//ARREGLO DE ESTADO DEL TERRENO
var estado =[]

//ARREGLO DE TIPO DEL TERRENO
var tipo=[]


async function getLotes(){   

    let index = document.querySelector("#index")
    let navbar = document.querySelector("#nabvar")
    let dashboard = document.querySelector("#dashboard") 
    
    //Preguntamos si tiene la clase
    if(!index.classList.contains("hidden")){
        //Ocultamos inicio
        index.classList.add("hidden")
    
        //Mostramos dashboard
        navbar.classList.remove("hidden")
        dashboard.classList.remove("hidden")
    }
    


    let response;
    try {
        response = await gapi.client.sheets.spreadsheets.values.batchGet({
            spreadsheetId: '1oWd2Nr4qCsJ9sSMrUcEIenZ_0pphDMREbVbVlUx6Ph8',
            ranges: ['Lotes!A:H', 'Lotes!J:L', 'Lotes!N:R']
        });


    } catch (err) {
        console.error(err)
        //document.getElementById('content').innerText = err.message;
        return;
    }

    //Evalua la longitud de la response
    const range = response.result.valueRanges;
    if (range.length == 0) {
        console.warn("No se encontraron valores")
        return;
    } 

    // Muestra por pantalla
    //console.log(response.result.valueRanges)

    lotes = convertToObjects(range[0].values)
    porcentajes = convertToObjects(range[1].values)
    socios = convertToObjects(range[2].values)

    //console.log(lotes, socios, porcentajes)
    
    mostrarLotes(lotes, porcentajes, socios);
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


function mostrarLotes(lotes, porcentajes, socios){

    //SECTION
    let section = document.createElement("section");
    section.setAttribute("class", "mt-4");
    section.setAttribute("id", "section-loteo");
    
    //TITLE
    let title = document.createElement("p")
    title.setAttribute("class", "uppercase text-red-600 font-semibold pl-8 mb-8")
    title.innerText="Lotes"

    section.appendChild(title)
    
    //BODY
    let div = document.createElement("div");
    div.setAttribute("class", "flex flex-col gap-y-4 items-center");

    //CARDS
    lotes.forEach(lote=>{

        let card_lote = createCardLote(lote, porcentajes, socios)

        div.appendChild(card_lote)

    })

    section.appendChild(div)
    container.appendChild(section)
    
}



function limpiar(){

    contenedor.innerHTML=''
}



function createCardLote(lote, porcentajes, socios){
 
    //Obtiene los socios de acuerdo al lote
    const sociosFilters = porcentajes.filter(objeto => objeto.id_lote === lote.id_lote);

     
    //Inner join de socio con indo de Lote
    const resultado = sociosFilters.map(socio => {
        const nombreInfo = socios.find(nombre => nombre.id_socio === socio.id_socio);
        return { ...socio, ...nombreInfo };
    });
        

    //console.log(resultado)
        
    let card_lote = document.createElement('div')
    card_lote.setAttribute('class',"flex flex-col gap-y-4 items-center")
    //console.log(lote)
    card_lote.setAttribute('id','lote'+lote.id_lote)
    card_lote.innerHTML=`
        <!-- Card para la  tarjeta -->
        <div class="flex border  w-fit border rounded-xl shadow-lg bg-white cursor-pointer hover:bg-slate-100">        

        <!-- Imagen -->
        <div class="w-40 h-40">
            <img class="h-full rounded-l-xl" src="https://img.freepik.com/foto-gratis/delimitacion-terreno-cielo-despejado_23-2149721839.jpg" alt="Modern building architecture">
        </div>
        
        <!--Info-->
        <div class="flex flex-col py-2 pl-2 pr-4 border-r max-w-md">
            <div class="mb-4">
            <p class="uppercase font-semibold text-red-600 text-md tracking-wide">${lote.nombre}</p>
            <p class="text-sm"> <span class="uppercase tracking-wide text-black leading-tight font-semibold"> ${lote.departamento} </span> - ${lote.direccion} </p>
            </div>
            <div class="">
            <p class="text-sm text-slate-500 tracking-wide leading-tight font-semibold"> Lorem ipsum dolor sit amet,udiandae ex quas in officiis, facilis sit recusandae eius? Exercitationem dolore est sapiente nemo dolorem ipsam!</p>
            </div>
        </div>
    
        
        <!-- Lotes -->
        <div class="flex flex-col gap-y-2 py-2 px-4 border-r">
            <p class="text-slate-500 font-semibold text-center">Lotes</p>
            <div class="flex flex-col h-full justify-between">
            <p class="border rounded p-1"> <span class="text-sm font-semibold"> Total: </span> ${lote.cant_terrenos} </p>
            <p class="border rounded p-1"> <span class="text-sm font-semibold"> Vendidos: </span> ${lote.vendidos} </p>
            <p class="border rounded p-1"> <span class="text-sm font-semibold"> Disponibles: </span> ${lote.disponibles} </p>
            </div>
        </div>
        
        <!--Socios-->
        <div class="flex flex-col gap-y-2 py-2 px-4">
            <p class="text-slate-500 font-semibold text-center">Socios</p>
            ${ 
               resultado.map( socio => {
                return createSocioHTML(socio)
               }).join('')
            
            }
            
        </div>            
    </div>  
    <!--Fin de la tarjeta -->               
    `

    card_lote.addEventListener('click',()=> getTerrenos(lote.id_lote));

    return card_lote;
            
     

    
}


function createSocioHTML(socio){

    return `
        <div class="flex items-center border rounded p-1 justify-between">
            <i class="flex items-center mr-1 text-red-600"><span class="material-icons-round">person</span></i>
            <!-- Mostraría la información del socio-->
            <a class="text-sm"> ${socio.nombre} ${socio.apellido} </a>
            <p class="ml-4">${socio.porcentaje} %</p>  
        </div>
    `

}



//ESTO DEBERÍA IR EN EL ARCHIVO DE TERRENOS PARA FACILITAR LA LECTURA
/*********************************************************************/

async function getTerrenos(id_lote){

    //Limpiamos la interface de Loteo
    let dashboard = document.querySelector("#body-dashboard")
    dashboard.innerHTML = ""

    //Muestra spinner
    spinner.classList.remove("hidden")  
  
    let response;
    try {
        response = await gapi.client.sheets.spreadsheets.values.batchGet({
            spreadsheetId: '1oWd2Nr4qCsJ9sSMrUcEIenZ_0pphDMREbVbVlUx6Ph8',
            ranges: ['Terrenos!A:M', 'Terrenos!O:U', 'Terrenos!W:X', 'Terrenos!Y:Z']
        });


    } catch (err) {
        console.error(err)
        //document.getElementById('content').innerText = err.message;
        return;
    }

    //Evalua la longitud de la response
    const range = response.result.valueRanges;
    if (range.length == 0) {
        console.warn("No se encontraron valores")
        return;
    } 

    // Muestra por pantalla
    //console.log(response.result.valueRanges)

    terrenos = convertToObjects(range[0].values)
    clientes = convertToObjects(range[1].values)
    tipo = convertToObjects(range[2].values)
    estado = convertToObjects(range[3].values)

    //Terrenos filtrados
    let terrenosFiltrados = terrenos.filter(terreno => terreno.id_lote == id_lote);
    //console.log(terrenosFiltrados)

    //Terrenos Frentistas
    let frentistas = terrenosFiltrados.filter(terreno => terreno.tipo === '2')
    //console.log(frentistas)

    //Terrenos Internos
    let internos = terrenosFiltrados.filter(terreno => terreno.tipo === '1')
    //console.log(internos)
   
    mostrarTerrenos(frentistas, internos, clientes);
    
    //Oculta spinner
    spinner.classList.add("hidden")     

}


function mostrarTerrenos(frentistas, internos, clientes){

    //console.log(frentistas, internos, clientes)

    //CREA LA SECTION
    let section = document.createElement("section")
    section.setAttribute("class", "px-8 mt-4")

    //CREA EL TITLE GENERAL
    let title = document.createElement("p")
    title.setAttribute("class", "uppercase text-red-600 font-semibold mb-8")
    title.innerText = "Altos de Carmelo"

    //CREA SUBTITLES
    let subtitle1 = document.createElement("p")
    subtitle1.setAttribute("class", "uppercase text-gray-500 font-semibold mb-2 pb-1 border-b-2 border-gray-300")
    subtitle1.innerText = "Lotes internos"

    let subtitle2 = document.createElement("p")
    subtitle2.setAttribute("class", "uppercase text-gray-500 font-semibold mb-2 pb-1 border-b-2 border-gray-300 mt-12")
    subtitle2.innerText = "Lotes frentistas"


    //CREA LA SECCION PARA LOS TERRENOS INTERNOS
    let sectionInternos = document.createElement("div")
    sectionInternos.setAttribute("class", "flex flex-wrap justify-between gap-x-4 gap-y-4")

    internos.forEach(terreno => {
        let card_terreno = createCardTerreno(terreno, clientes)

        sectionInternos.appendChild(card_terreno)
    });


    //CREA LA SECCION PARA LOS TERRENOS FRENTISTAS
    let sectionFrentistas = document.createElement("div")
    sectionFrentistas.setAttribute("class", "flex flex-wrap justify-between gap-x-4 gap-y-4")

    frentistas.forEach(terreno => {
        let card_terreno = createCardTerreno(terreno, clientes)

        sectionFrentistas.appendChild(card_terreno)
    });


    //AÑADIMOS COMO HIJO

    section.appendChild(title)
    section.appendChild(subtitle1)
    section.appendChild(sectionInternos)
    section.appendChild(subtitle2)
    section.appendChild(sectionFrentistas)

    container.appendChild(section)


}


function createCardTerreno(terreno, clientes){
    
    //CREA LA CARD PARA EL TERRENO
    let card_terreno = document.createElement("div")
    card_terreno.setAttribute("class", "w-1/5 border bg-white shadow-md p-4 rounded-md hover:bg-slate-100")

    card_terreno.innerHTML = `
        <div class="flex justify-between items-center mb-4">
            <p class="uppercase tracking-wide font-semibold">${terreno.nro}</p>
            <a href="#" class="text-sm text-blue-600">Ver plano</a>
        </div>
        <div class="flex flex-col gap-y-2">
            <p class="text-sm text-slate-500 tracking-wide leading-tight font-semibold">Valor de venta: ${terreno.valor_de_venta}</p>
            <p class="text-sm ${(terreno.id_cliente === 'NULL')?'text-green-600': 'text-black'} tracking-wide leading-tight font-semibold">${(terreno.id_cliente === 'NULL')?'Disponible': getCliente(terreno.id_cliente, clientes)}</p>
        </div>
    `

    return card_terreno;

}


function getCliente(id_cliente, clientes){
    let cli = clientes.find(objeto => objeto.id_cliente == id_cliente);
    //console.log(cli, clientes)
    return `${cli.nombre.charAt(0).toUpperCase() + cli.nombre.slice(1)} ${cli.apellido.charAt(0).toUpperCase() + cli.apellido.slice(1)}`
}