

const titulo = document.getElementById("titulo")

const div = document.getElementById("municipio");
const codigo = div.getAttribute("data-codigo");

const url = `/api/municipioAll/${codigo}`
fetch(url)
    .then(response => response.json())
    .then(municipio => {
        titulo.innerHTML = municipio.alquiler[0].nom_territori


        //Line chart
        const lineChart1 = document.getElementById('lineChartAlq').getContext('2d');

        const alquiler = municipio.alquiler.map(m => ({ any: m.any, renda: m.renda, habitatges : m.habitatges }));

        alquiler.sort((a, b) => a.any - b.any);
        
        
        const alquilerAnyo = alquiler.map(m => m.any);
        const alquilerRenda = alquiler.map(m => m.renda);
        const alquilerHabitatges= alquiler.map(m => m.habitatges);


        const dataAlquiler = {
        labels: alquilerAnyo,
        datasets: [{
            label: 'Alquiler (€)',
            data: alquilerRenda,
            fill: false,
            borderColor: 'blue',
            tension: 0.1
        }]
        };

        const configAlquiler = {
        type: 'line',
        data: dataAlquiler,
        options: {
            responsive: true,
            scales: {
            y: {
                beginAtZero: true
            }
            }
        }
        };

        const lineChart2 = document.getElementById('lineChartHab').getContext('2d');
        
        const dataAlquilerHab = {
        labels: alquilerAnyo,
        datasets: [{
            label: 'Viviendas',
            data: alquilerHabitatges,
            fill: false,
            borderColor: 'red',
            tension: 0.1
        }]
        };

        const configAlquilerHab = {
        type: 'line',
        data: dataAlquilerHab,
        options: {
            responsive: true,
            scales: {
            y: {
                beginAtZero: true
            }
            }
        }
        };

        //Pie chart

        const pieChart = document.getElementById('pieChart').getContext('2d');

        const energia = municipio.energia.map(m => ({ sector: m.descripcio_sector, cosumo: m.consum_kwh }));

        energia.sort((a, b) => a.cosumo - b.cosumo);
        
        
        const energiaSector = energia.map(m => m.sector);
        const energiaConsumo = energia.map(m => m.cosumo);

        const dataEnergia = {
        labels: energiaSector,
        datasets: [{
            label: 'Consumo (kwh)',
            data: energiaConsumo,
            backgroundColor: [
            'rgba(255, 99, 132, 0.7)',    // rojo
            'rgba(255, 206, 86, 0.7)',    // amarillo
            'rgba(54, 162, 235, 0.7)',    // azul
            'rgba(255, 159, 64, 0.7)'     // naranja
            ],
            borderColor: 'white',
            borderWidth: 2
        }]
        };

        const configEnergia = {
        type: 'pie',
        data: dataEnergia,
        options: {
            responsive: true,
            plugins: {
            legend: {
                position: 'bottom',
            },
            tooltip: {
                enabled: true,
            }
            }
        }
        };
        
        const lineChartA = new Chart(lineChart1, configAlquiler);
        const lineChartB= new Chart(lineChart2, configAlquilerHab);
        const pieChart1 = new Chart(pieChart, configEnergia);
        
    }
)

