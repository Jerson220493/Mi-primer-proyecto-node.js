// const express = require('express')  

/*emascripts modules*/
import express from 'express' // debe ir comillas en la importacion from " aca va la dependencia "

import csrf from "csurf";
import cookieParser from 'cookie-parser';

/* importamos el archivo con las rutas*/
import usuariosRoutes from './routes/usuariosRoutes.js' // esta importacion al no ser una dependiencia  debemos colocar la extension
import propiedadesRoutes from './routes/propiedadesRoutes.js' // esta importacion al no ser una dependiencia  debemos colocar la extension
import appRoutes from './routes/appRoutes.js' // esta importacion al no ser una dependiencia  debemos colocar la extension
import apiRoutes from './routes/apiRoutes.js' // esta importacion al no ser una dependiencia  debemos colocar la extension

/* importamos el archivo de conexion a la base de datos*/
import db from './config/db.js';

// esta variable contiene toda la informacion del servidor
const app = express(); 

// habilitar lectura de datos de formulario, sin esto no lee los datos enviados por post
app.use( express.urlencoded({extended : true}))

// habilitar cookie parser
app.use( cookieParser() )

// habilidar csrf
app.use(csrf({cookie:true}))

/** conexion a la base de datos */
try {
    await db.authenticate();
    db.sync();
    console.log('Conexion correcta a la base de datos')
} catch (error) {
    console.log(error)
}

// habitar pug que es nuestra plantilla engine de este proyecto 
// con set agregamos configuracion
app.set('view engine', 'pug');
app.set('views', './views'); // la carpeta donde van a estar ubicadas las vistas


// carpeta publica css o imagenes aca indicamos en donde encontrar los archivos basicos
// crear las carpetas img js y css
app.use(express.static('public'))

// Routing 
/* desde la pagina principal escuchamos el evento y lo buscamos en el archivo de rutas*/
// app.get('/', usuariosRoutes); // cuando se usa get se busca la ruta exacta
app.use('/api', apiRoutes);
app.use('/', appRoutes);
app.use('/auth', usuariosRoutes);  // cuando se usa use se busca patrones de ruta
app.use('/', propiedadesRoutes);  // cuando se usa use se busca patrones de ruta

// Definir un puerto y arrancar el proyecto
const port = process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log(`El puerto esta funcionando correctamente ${port}`)
})