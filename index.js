// Importamos las bibliotecas necesarias
import express from "express";

// Importamos las rutas

/*
import notificacionesRoute from "./routes/notificacions.js";
import reservasRoute from "./routes/reservas.js";
import recursosRoute from "./routes/recursos.js";
import usuariosRoute from "./routes/usuarios.js";
*/
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


app.get("map/:id", async (req,res)=>{
    const codi = parseInt(req.params.id);
    const url = `https://analisi.transparenciacatalunya.cat/resource/9aju-tpwc.json?codi=${codi}`
    const response = await fetch(url)
    const data = await response.json()
    
    if(!data) res.status(404).json({message : "Municipio no encontrado"});
    else {
        res.render("municipio", {municipio})
    }
});



/*
/// Usamos las rutas de la carpetea routes
app.use("/notificaciones", notificacionesRoute);
app.use("/reservas", reservasRoute);
app.use("/recursos",recursosRoute);
app.use("/usuarios", usuariosRoute);
*/
// Iniciamos el servidor en un solo puerto
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});