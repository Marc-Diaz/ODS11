
//ENDPOINT MAPA
let url = "http://localhost:3000/api/municipiosReciclaje"

//MAPA
const maxPuntos = 2147483647
const map = L.map('map', {
    zoom: 5,
    minZoom: 5,
    maxZoom: 20
}).setView([41.8675, 1.5208], 8.);
let limites = [
    [21.698265, -25.708008],
    [55.028022, 18.237305]
]
map.setMaxBounds(limites);

//ESCALA DE COLOR
const escalaColor = chroma.scale(['red', 'yellow', 'green']).domain([0, 255]);

// Añadir el mapa
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

fetch(url)
    .then(response => response.json())
    .then(data => {
        console.log(data)
        let puntos = 0;
        data.forEach(punto => {
            if (puntos < maxPuntos && punto.latitud && punto.longitud) {
                
                let reciclaje = punto.kg_hab_any_recollida_selectiva
                const color = escalaColor(reciclaje).hex();

                const municipio = punto.nom?.normalize("NFD").replace(/[^\w\s]/g, "") || "Desconocido";
                const marcador = L.circleMarker([punto.latitud, punto.longitud], {
                    radius: 6,
                    fillColor: color,
                    color: "#000",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                }).addTo(map)
                .bindPopup(`<b>${municipio}</b>`);

                marcador.on('click', () => {
                document.getElementById('informacion_municipio').innerHTML = `
                    <h3>Información del municipio</h3>
                    <p><strong>Nombre:</strong> ${municipio}</p>
                    <p><strong>CODI:</strong> ${punto.codi}</p>
                    `;                });
                puntos++;
                
                // Mostrar popup al pasar el ratón (hover)
                marcador.on('mouseover', function () {
                    this.openPopup();
                });
  
                // Ocultar popup al quitar el ratón
                marcador.on('mouseout', function () {
                    this.closePopup();
                });
  
                // Redirigir al hacer clic en el marcador
                marcador.on('click', function () {
                    window.location.href = `map/${punto.codi}`;
                });
            }
        });
    }
)

