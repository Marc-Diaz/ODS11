import express from "express";
import fs from "fs";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import {combinarEndPointsPorMunicipio} from "../utils/combinar.js"
//Crea l'objecte de l'aplicació
const route = express.Router();

const readData = () => {
    try {
        const data = fs.readFileSync("db/municipios.json");
        return JSON.parse(data);
    } catch (error) {
        console.error(error);
    }
};

//Escriu dades al fitxer
const writeData = (data) => {
    try {
        fs.writeFileSync("db/municipios.json", JSON.stringify(data));
    } catch (error) {
        console.error(error);
    }
};

route.get("/municipiosReciclaje", (req,res)=>{
  const data = readData();
  res.json(data)
});


route.get("/municipioAll/:id", async (req,res)=>{
  const codi = parseInt(req.params.id);
  const data = await combinarEndPointsPorMunicipio(codi)
  res.json(data)
});

  
export default route

