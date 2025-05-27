// DENSIDAD
// https://analisi.transparenciacatalunya.cat/resource/b9cr-32i4.json
// RENDAS
// https://analisi.transparenciacatalunya.cat/resource/qww9-bvhh.json/?any=2024&periode=gener-desembre

// URLs de ejemplo (debes reemplazarlas con tus APIs reales)
const densidadAPI = 'https://analisi.transparenciacatalunya.cat/resource/b9cr-32i4.json';
const rentaAPI = 'https://analisi.transparenciacatalunya.cat/resource/qww9-bvhh.json/?any=2024&periode=gener-desembre';

async function fetchData() {
  const [densidadRes, rentaRes] = await Promise.all([
    fetch(densidadAPI).then(res => res.json()),
    fetch(rentaAPI).then(res => res.json())
  ]);

  // Indexar por nombre de municipio para hacer merge
  const rentaMap = new Map(rentaRes.map(r => [r.codi_territorial, r.renta]));

  const datosCombinados = densidadRes
    .map(d => {
      const renta = rentaMap.get(d.codi_ine_c);
      if (renta !== undefined) {
        return { x: d.densidad, y: renta, label: d.municipi };
      }
      return null;
    })
    .filter(p => p !== null);

  return datosCombinados;
}

async function renderChart() {
  const datos = await fetchData();

  const ctx = document.getElementById('scatterChart').getContext('2d');
  new Chart(ctx, {
    type: 'scatter',
    data: {
      datasets: [{
        label: 'Municipios de Cataluña',
        data: datos,
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        pointRadius: 6
      }]
    },
    options: {
      scales: {
        x: {
          title: {
            display: true,
            text: 'Densidad de población (hab/km²)'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Renta media (€)'
          }
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: context => `${context.raw.label}: Densidad = ${context.parsed.x}, Renta = €${context.parsed.y}`
          }
        }
      }
    }
  });
}

renderChart();