//import lotes from lotes.js

const loteContainer=document.getElementById('lote')



function createLote(lote,index){
    const nuevoLote=document.createElement('div')
    nuevoLote.setAttribute('class','card')
    nuevoLote.classList = "lote";
    nuevoLote.innerHTML = `
      <ul class='list-group list-group-flush' id='ul' ></ul>
      <li class='list-group-item bg-info'>${lote.nombre}</li>
      <li class='list-group-item bg-info'>Cantidad de lotes ${lote.cantT}</li>
      <li class='list-group-item bg-info'>id lote ${lote.idL}</li>

    `
    //nuevoLote.addEventListener("click", ()=> actualizarDetalle(index))
    loteContainer.appendChild(nuevoLote);
}

function mostrarlotes(){
    loteContainer.innerHTML = "";
    lotes.forEach((lote,i) => {
      createLote(lote,i);
    })
  }