

const titulo = document.getElementById("titulo")

const div = document.getElementById("municipio");
const codigo = div.getAttribute("data-codigo");

const url = `http://localhost:3000/api//municipioAll/${codigo}`
fetch(url)
    .then(response => response.json())
    .then(data => {
        titulo.innerHTML = data.alquiler[0].nom_territori
    }
)

