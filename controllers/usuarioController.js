import { check, validationResult } from "express-validator";
import Usuario from "../models/Usuario.js";
import { generateID } from "../helpers/tokens.js";
import { emailRegistro } from "../helpers/email.js"

const formularioLogin = (req, res)=>{
    res.render('auth/login', {
        pagina : 'Iniciar Sesión'
    }) // render es el metodo para imprimir un template engine, como segundo parametros se puede pasar un objeto con informacion
}

const formularioRegistro = (req, res)=>{
    res.render('auth/registro', {
        pagina : 'Crear Cuenta'
    }) // render es el metodo para imprimir un template engine, como segundo parametros se puede pasar un objeto con informacion
}

const registrar = async (req, res)=>{ // aca vamos a registrar un usuario nuevo 
    // en este caso vamos a utilizar el req
    
    //validacion
    await check('nombre').notEmpty().withMessage('El nombre no puede estar vacío').run(req);
    await check('email').isEmail().withMessage('Eso no parece un email').run(req);
    await check('password').isLength({ min:6 }).withMessage('El password debe ser de al menos 6 caracteres').run(req);
    await check('repite_password').equals(req.body.password).withMessage('Los password no son iguales').run(req);

    let resultado = validationResult(req);
    // validattions Result almacena los check 

    // validar que el resultado este vacío
    if (!resultado.isEmpty()) {
        // errores
        return res.render('auth/registro', {
            pagina : 'Crear Cuenta',
            errores : resultado.array(),
            usuario :{ 
                nombre : req.body.nombre,
                email : req.body.email
            }
        })
    }

    // extraer los datos
    const {nombre, email, password} = req.body;

    // verificar que el usuarios no este duplicado
    const existeUsuario = await Usuario.findOne({ where : {email}});
    if(existeUsuario){
        return res.render('auth/registro', {
            pagina : 'Crear Cuenta',
            errores : [{msg : 'El usaurio ya esta registrado'}],
            usuario :{ 
                nombre : req.body.nombre,
                email : req.body.email
            }
        })
    }
    
    const usuarioCreate = await Usuario.create({
        nombre,
        email,
        password,
        token : generateID()
    })

    emailRegistro({
        nombre : usuarioCreate.nombre,
        email : usuarioCreate.email,
        token : usuarioCreate.token
    })



    // mostrar mensaje de confirmacion
    res.render('templates/mensaje', {
        pagina : "Cuenta creada exitosamente",
        mensaje : "Hemos enviado un correo con la confirmacion de la cuenta, por favor da click en el enlace"
    })

}

const confirma = (req, res) => {

    const {token} = req.params;
    console.log(token)

}

const formularioRecuperarPass = (req, res)=>{
    res.render('auth/recuperar_pass', {
        pagina : 'Recuperar password'
    }) // render es el metodo para imprimir un template engine, como segundo parametros se puede pasar un objeto con informacion
}

/** export default solo puede enviar uno */
/** export nombrados puede exportar varios */
export {
    formularioLogin,
    formularioRegistro,
    formularioRecuperarPass,
    registrar,
    confirma
}
