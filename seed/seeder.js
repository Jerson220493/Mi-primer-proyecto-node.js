import categorias from './categorias.js';
import precios from './precios.js';
import {Categoria, Precio} from '../models/index.js';
import db from '../config/db.js';

const importarDatos = async () => {
    try {
        // autenticar la base de datos
        await db.authenticate();

        // generar las columnas
        await db.sync();

        // insertamos los datos
        // con promise ejecuta los dos querys en simultaneo
        await Promise.all([
            Categoria.bulkCreate(categorias),
            Precio.bulkCreate(precios)
        ])

        console.log('Datos importados correctamente')
        process.exit(0) // termina la ejecucion sin errores
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
}

const eliminarDatos = async () =>{
    try {
        //await Promise.all([
            // Categoria.destroy({where : {}, truncate : true}),
            // Precio.destroy({where : {}, truncate : true})
        //])
        await db.sync({force : true})
        console.log('Datos eliminados correctamente')
        process.exit(0) // termina la ejecucion sin errores
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
}

if (process.argv[2] === '-i') { // si pasamos i importamos datos
    importarDatos();
}

if (process.argv[2] === '-e') { // si pasamos e eliminamos datos
    eliminarDatos();
}
