import { DataTypes } from "sequelize";  // 
import bcrypt from "bcrypt";
import db from "../config/db.js";

const Usuario = db.define("usuarios",{
    nombre:{
        type : DataTypes.STRING,    // el tipo de dato
        allowNull : false           // define si puede o no ir vacio
    },
    email : {
        type : DataTypes.STRING,
        allowNull : false
    },
    password : {
        type : DataTypes.STRING,
        allowNull : false
    },
    token : DataTypes.STRING,       // asi se puede definir cuando solo lleva el tipo de dato
    confirmado : DataTypes.BOOLEAN
},{
    hooks : {
        beforeCreate : async function(usuario) {
            /*hashear un password*/
            const salt = await bcrypt.genSalt(10);
            usuario.password = await bcrypt.hash(usuario.password, salt);
        }
    }
});

// Métodos personalizados
Usuario.prototype.verificarPassword = function(password){
    return bcrypt.compareSync(password, this.password)
}

export default Usuario;
