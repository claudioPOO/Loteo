let lotes;

async function Cargar() {
    let response;
     
    try {
      // Fetch first 10 files
      response = await gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: '1bMFLtrW1-2tifKMJl7_r-HxSvW7G-4Dwedv_R8hyZ-Y',
        range: 'Hoja 1!A2:C',
        
      });
    } catch (err) {
      document.getElementById('lote').innerText = err.message;
      return;
    }
    const range = response.result;
    
    if (!range || !range.values || range.values.length == 0) {
      document.getElementById('lote').innerText = 'No values found.';
      return;
    }
    lotes=[]
    const output = range.values
    output.forEach(fila => {
        const nuevolote={
            nombre:fila[0],
            cantT:fila[1],
            idL:fila[2]
        }
        lotes.push(nuevolote)
    });
    
  }