import { Sequelize } from "sequelize";
import  dotenv  from "dotenv";
dotenv.config({path : '.env'})

const db = new Sequelize(process.env.BD_NOMBRE, process.env.BD_USER, process.env.BD_PASS ?? '',{
    host : process.env.BD_HOST,
    port : '3307',
    dialect : 'mysql',
    define : {
        timestamps : true
    },
    pool :{ /** cada que se visita una pagina web se crea una conexion a la base de datos el pool configura conexiones*/
        max : 5, /* maximo de conexiones de mantener*/
        min : 0, /* el minimo de conexiones */
        acquire : 30000, /** 30 segundos intentando conectar */
        idle : 10000 /* 10 segundo antes de abortar la conexion  */
    },
    operatorsAliases : false
});

export default db;