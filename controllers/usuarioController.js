import { check, validationResult } from "express-validator";
import Usuario from "../models/Usuario.js";

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
    await check('repite_password').equals('password').withMessage('Los password no son iguales').run(req);
    let resultado = validationResult(req);
    // validattions Result almacena los check 

    // validar que el resultado este vacío
    if (!resultado.isEmpty()) {
        // errores
        return res.render('auth/registro', {
            pagina : 'Crear Cuenta',
            errores : resultado.array()
        })
    }
    const usuario = await Usuario.create(req.body);
    res.json(usuario)   
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
    registrar
}
