// Importamos las bibliotecas necesarias
import express from "express";
// Importamos las rutas
import route from "./routes/index.js";

//Configuración
import { PORT } from "./config.js";

// Creamos la aplicación
const app = express();
app.use(express.json())


//EJS
app.use(express.static("public"));//carpeta publica pel css
app.set('view engine','ejs');//Fem servir el motor ejs
app.set('views', './views'); //carpeta on desem els arxius .ejs


//Endpoints RENEDER
app.get("/", (req, res)=> {
    res.render("index")
});

app.get("/map", (req, res)=> {
    res.render("map")
});

app.get("/propuesta", (req, res)=> {
    res.render("propuesta")
});

app.get("/problemas", (req, res)=> {
    res.render("problemas")
});

app.get("/conclusiones", (req, res)=> {
    res.render("conclusiones")
});


app.get("/map/:id", async (req,res)=>{
    const codi = req.params.id;
    res.render("municipio", {codi})
});





app.use("/api", route);

// Iniciamos el servidor en un solo puerto
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
})
