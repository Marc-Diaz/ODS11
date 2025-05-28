import express from "express";
import fs from "fs";
import bodyParser from "body-parser";
import fetch from "node-fetch";
//Crea l'objecte de l'aplicació
const route = express.Router();

const readData = () => {
    try {
        const data = fs.readFileSync("db/db.json");
        return JSON.parse(data);
    } catch (error) {
        console.error(error);
    }
};

//Escriu dades al fitxer
const writeData = (data) => {
    try {
        fs.writeFileSync("db/db.json", JSON.stringify(data));
    } catch (error) {
        console.error(error);
    }
};
250019
function extraerClaveCodigo(codigo) {
    if (!codigo) return null;
    return codigo.toString().substring(0, 5);
  }
  


  async function combinarEndPointsPorMunicipio(codigoMunicipio6) {

    let codigoMunicipio5 = codigoMunicipio6.toString().substring(0, 5);
    // Construcción de URLs con filtros específicos por municipio
    const urlAlquiler = `https://analisi.transparenciacatalunya.cat/resource/qww9-bvhh.json?any=2024&periode=gener-desembre&codi_territorial=${codigoMunicipio5}`;
    const urlIndicadores = `https://analisi.transparenciacatalunya.cat/resource/b9cr-32i4.json?codi_ine_c=${codigoMunicipio5}`;
    const urlEnergia = `https://analisi.transparenciacatalunya.cat/resource/8idm-becu.json?cdmun=${codigoMunicipio5}`;
    const urlResiduos = `https://analisi.transparenciacatalunya.cat/resource/69zu-w48s.json?codi_municipi=${codigoMunicipio6}`;
    const urlLocalizacion = `https://analisi.transparenciacatalunya.cat/resource/9aju-tpwc.json?codi=${codigoMunicipio6}`;
  
    // Fetch paralelo
    const [alquilerRes, indicadoresRes, energiaRes, residuoRes, localizacionRes] = await Promise.all([
      fetch(urlAlquiler),
      fetch(urlIndicadores),
      fetch(urlEnergia),
      fetch(urlResiduos),
      fetch(urlLocalizacion)
    ]);
  
    // Parseo JSON
    const alquiler = await alquilerRes.json();
    const indicadores = await indicadoresRes.json();
    const energia = await energiaRes.json();
    const residuos = await residuoRes.json();
    const localizacion = await localizacionRes.json();
  
    // Construcción del objeto resultado para este municipio
    const datosMunicipio = {
      alquiler,
      indicadores,
      energia,
      residuos,
      localizacion
    };
  
    return datosMunicipio;
  }
  


route.get("/all", async (req, res)=> {
    const data=readData();

    const urlLocaliczacion = `https://analisi.transparenciacatalunya.cat/resource/9aju-tpwc.json?`
    const localizacionRes = await fetch(urlLocaliczacion)
    const localizacionJSON = await localizacionRes.json()

    const resultados = await Promise.all(
        localizacionJSON.map(async (municipio) => {
          const codigoMunicipio = municipio.codi;
          if (!codigoMunicipio) return null;
  
          // Esperamos el resultado asíncrono
          const datosMunicipio = await combinarEndPointsPorMunicipio(codigoMunicipio);
  
          const newMunicipio = {
            id: codigoMunicipio,
            ...datosMunicipio,
          };
  
          data.push(newMunicipio);
          return newMunicipio;
        })
      );
  
      // Guardamos la data actualizada solo una vez
      writeData(data);
});

  
export default route