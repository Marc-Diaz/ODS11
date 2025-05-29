const indicadoresAPI = 'https://analisi.transparenciacatalunya.cat/resource/b9cr-32i4.json?$limit=5699';

async function fetchIndicadores() {
  const res = await fetch(indicadoresAPI);
  const data = await res.json();

  const datosFiltrados = data
    .filter(d => d["any"] && d["i_19"] && d["i_20"])
    .map(d => ({
      any: d["any"],
      noOrdenado: parseFloat(d["i_19"]),
      urbanizable: parseFloat(d["i_20"])
    }));

  return datosFiltrados;
}

async function renderLineChart() {
  const datos = await fetchIndicadores();

  // Agrupar por año
  const agrupados = {};
  datos.forEach(d => {
    if (!agrupados[d.any]) agrupados[d.any] = { noOrdenado: [], urbanizable: [] };
    agrupados[d.any].noOrdenado.push(d.noOrdenado);
    agrupados[d.any].urbanizable.push(d.urbanizable);
  });

  const años = Object.keys(agrupados).sort();
const datosNoOrdenado = años.map(a => {
  const arr = agrupados[a].noOrdenado.filter(v => typeof v === 'number' && !isNaN(v));
  return +(arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2);
});

const datosUrbanizable = años.map(a => {
  const arr = agrupados[a].urbanizable.filter(v => typeof v === 'number' && !isNaN(v));
  return +(arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2);
});

  const ctx = document.getElementById('lineChart').getContext('2d');
  Chart.defaults.color = '#FFFFFF';
  Chart.defaults.borderColor = '#FFFFFF'
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: años,
      datasets: [
        {
          label: 'Incremento viviendas suelo no ordenado (%)',
          color: 'white',
          data: datosNoOrdenado,
          borderColor: 'rgb(54, 162, 235)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          tension: 0.0,
          fill: false,
          pointRadius: 5,
        },
        {
          label: 'Incremento viviendas suelo urbanizable (%)',
          data: datosUrbanizable,
          borderColor: 'rgb(255, 159, 64)',
          backgroundColor: 'rgba(255, 159, 64, 0.2)',
          tension: 0.0,
          fill: false,
          pointRadius: 5
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Evolución de incremento de viviendas por tipo de suelo',
        },
      
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Año',

          }
        },
        y: {
          title: {
            display: true,
            text: 'Incremento (%)',

          },
        }
      }
    }
  });
}

renderLineChart();

const residuosAPI = 'https://analisi.transparenciacatalunya.cat/resource/69zu-w48s.json?$limit=25000'; 
async function fetchTopMunicipios() {
  const res = await fetch(residuosAPI);
  const data = await res.json();

  // Filtrar registros válidos
  const filtrado = data
    .filter(d => d["kg_hab_any_recollida_selectiva"] && !isNaN(parseFloat(d["kg_hab_any_recollida_selectiva"])))
    .map(d => ({
      municipio: d["municipi"],
      recogida: parseFloat(d["kg_hab_any_recollida_selectiva"])
    }));

  // Ordenar descendente y tomar los 10 primeros
  const top10 = filtrado
    .sort((a, b) => b.recogida - a.recogida)
    .slice(0, 10);

  return top10;
}

const viridisColors = [
  '#440154', '#482878', '#3E4989', '#31688E', '#26828E',
  '#1F9E89', '#35B779', '#6CCE59', '#B4DE2C', '#FDE725'
];

async function renderBarChart() {
  const datos = await fetchTopMunicipios();

  const ctx = document.getElementById('barChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: datos.map(d => d.municipio),
      datasets: [{
        label: 'Kg/hab/año recogida selectiva',
        data: datos.map(d => d.recogida),
      backgroundColor: viridisColors,
        borderColor: viridisColors,
        borderWidth: 1
      }]
    },
    options: {
      indexAxis: 'x',
      scales: {
        x: {
          ticks: {
            autoSkip: false,
            maxRotation: 45,
            minRotation: 45
          },
          title: {
            display: true,
            text: 'Municipio'
          }
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Kg/hab/año'
          }
        }
      },
      plugins: {
        title: {
          display: true,
          text: 'Top 10 Municipios con Mayor Recogida Selectiva'
        },
        tooltip: {
          callbacks: {
            label: context => `${context.label}: ${context.parsed.y} kg/hab/año`
          }
        }
      }
    }
  });
}

renderBarChart();

const energiaAPI = 'https://analisi.transparenciacatalunya.cat/resource/8idm-becu.json?$limit=49797'; // Sustituye por la URL real

async function fetchConsumoEnergetico() {
  const res = await fetch(energiaAPI);
  const data = await res.json();

  // Filtrar datos sin consumo válido ni observaciones de secreto
  const filtrados = data
    .filter(d => d["consum_kwh"] && !isNaN(parseFloat(d["consum_kwh"])) && (!d["observacions"] || !d["observacions"].toLowerCase().includes("secret")))
    .map(d => ({
      sector: d["descripcio_sector"],
      consumo: parseFloat(d["consum_kwh"])
    }));

  // Agrupar por sector
  const consumoPorSector = {};
  filtrados.forEach(d => {
    if (!consumoPorSector[d.sector]) consumoPorSector[d.sector] = 0;
    consumoPorSector[d.sector] += d.consumo;
  });

  const labels = Object.keys(consumoPorSector);
  const valores = Object.values(consumoPorSector);

  return { labels, valores };
}

async function renderPieChart() {
  const { labels, valores } = await fetchConsumoEnergetico();

  const ctx = document.getElementById('pieChart').getContext('2d');
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        label: 'Consumo energético por sector (kWh)',
        data: valores,
        backgroundColor: [
          '#ff9999', '#66b3ff', '#99ff99', '#ffcc99',
          '#c2c2f0', '#ffb3e6', '#c2f0c2', '#ffdb4d'
        ]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Distribución del Consumo Eléctrico por Sector en Cataluña'
        },
        tooltip: {
          callbacks: {
            label: context => {
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const valor = context.parsed;
              const porcentaje = ((valor / total) * 100).toFixed(1);
              return `${context.label}: ${valor.toLocaleString()} kWh (${porcentaje}%)`;
            }
          }
        },
        legend: {
          position: 'right',
          labels: {
            generateLabels: function (chart) {
              const data = chart.data;
              const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
              return data.labels.map((label, i) => {
                const value = data.datasets[0].data[i];
                const percentage = ((value / total) * 100).toFixed(1);
                return {
                  text: `${label} (${percentage}%)`,
                  fillStyle: data.datasets[0].backgroundColor[i],
                  strokeStyle: data.datasets[0].borderColor ? data.datasets[0].borderColor[i] : data.datasets[0].backgroundColor[i],
                  index: i
                };
              });
            }
          }
        }
      }
    }
  });
}

renderPieChart();