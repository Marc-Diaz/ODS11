export async function combinarEndPointsPorMunicipio(codigoMunicipio6) {

    let codigoMunicipio5 = codigoMunicipio6.toString().substring(0, 5);
    // Construcción de URLs con filtros específicos por municipio
    const urlAlquiler = `https://analisi.transparenciacatalunya.cat/resource/qww9-bvhh.json?any=2024&periode=gener-desembre&codi_territorial=${codigoMunicipio5}`;
    const urlIndicadores = `https://analisi.transparenciacatalunya.cat/resource/b9cr-32i4.json?codi_ine_c=${codigoMunicipio5}&any=2020`;
    const urlEnergia = `https://analisi.transparenciacatalunya.cat/resource/8idm-becu.json?cdmun=${codigoMunicipio5}&any=2020`;
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