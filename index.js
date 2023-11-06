// crear la app
/*comon js*/
// const express = require('express')  

/*emascripts modules*/
import express from 'express' // debe ir comillas en la importacion from " aca va la dependencia "

/* importamos el archivo con las rutas*/
import usuariosRoutes from './routes/usuariosRoutes.js' // esta importacion al no ser una dependiencia  debemos colocar la extension

// esta variable contiene toda la informacion del servidor
const app = express();

//habitar pug que es nuestra plantilla engine de este proyecto 
// con set agregamos configuracion
app.set('view engine', 'pug');
app.set('views', './views'); // la carpeta donde van a estar ubicadas las vistas

// Routing 
/* desde la pagina principal escuchamos el evento y lo buscamos en el archivo de rutas*/
// app.get('/', usuariosRoutes); // cuando se usa get se busca la ruta exacta
app.use('/auth', usuariosRoutes);  // cuando se usa use se busca patrones de ruta

// Definir un puerto y arrancar el proyecto
const port = 3000;
app.listen(port, ()=>{
    console.log(`El puerto esta funcionando correctamente ${port}`)
})