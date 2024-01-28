import categorias from './categorias.js';
import precios from './precios.js';
import Categoria from '../models/Categoria.js';
import Precio from '../models/Precio.js';
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



if (process.argv[2] === '-i') {
    importarDatos();
}
