import { check, validationResult } from "express-validator";
import Usuario from "../models/Usuario.js";
import bcrypt from "bcrypt";
import { generateID } from "../helpers/tokens.js";
import { emailRegistro, emailOlvidePass } from "../helpers/email.js";


const formularioLogin = (req, res)=>{
    res.render('auth/login', {
        pagina : 'Iniciar Sesión'
    }) // render es el metodo para imprimir un template engine, como segundo parametros se puede pasar un objeto con informacion
}

const formularioRegistro = (req, res)=>{

    res.render('auth/registro', {
        pagina : 'Crear Cuenta',
        csrfToken : req.csrfToken()
    }) // render es el metodo para imprimir un template engine, como segundo parametros se puede pasar un objeto con informacion
}

const registrar = async (req, res)=>{ // aca vamos a registrar un usuario nuevo 
    // en este caso vamos a utilizar el req
    
    //validacion
    await check('nombre').notEmpty().withMessage('El nombre no puede estar vacío').run(req);
    await check('email').isEmail().withMessage('Eso no parece un email').run(req);
    await check('password').isLength({ min:6 }).withMessage('El password debe ser de al menos 6 caracteres').run(req);
    await check('repite_password').equals(req.body.password).withMessage('Los password no son iguales').run(req);

    let resultado = validationResult(req); // aca se guarda en un array los errores de las validaciones
    // validattions Result almacena los check 

    // validar que el resultado este vacío
    if (!resultado.isEmpty()) {
        // errores
        return res.render('auth/registro', {
            pagina : 'Crear Cuenta',
            csrfToken : req.csrfToken(),
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
            csrfToken : req.csrfToken(),
            errores : [{msg : 'El usaurio ya esta registrado'}],
            usuario :{ 
                nombre : req.body.nombre,
                email : req.body.email
            }
        })
    }
    
    // creacion del usuario nuevo 
    const usuarioCreate = await Usuario.create({
        nombre,
        email,
        password,
        token : generateID()  // esta funcion esta definida en helper token.js
    })

    // enviar email de confirmacion 
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

const confirma = async (req, res) => {
    const {token} = req.params;
    // verificar el token es valido
    const usuario = await Usuario.findOne({ where: {token} }) // buscamos si existe ese token en los usuarios
    console.log(usuario)
    if (!usuario) {
        return res.render('auth/confirmar-cuenta', {
            pagina : 'Error al confirmar tu cuenta',
            mensaje : "Hubo un error al confirmar tu cuenta, intenta de nuevo",
            error : true
        }) 
    }
    // confirmar la cuenta
    usuario.token = null;
    usuario.confirmado = true;
    await usuario.save();
    res.render('auth/confirmar-cuenta', {
        pagina : 'Cuenta confirmada',
        mensaje : "La cuenta fue confirmada correctamente"
    }) 
}

const formularioRecuperarPass = (req, res)=>{
    res.render('auth/recuperar_pass', {
        pagina : 'Recuperar password',
        csrfToken : req.csrfToken()
    }) // render es el metodo para imprimir un template engine, como segundo parametros se puede pasar un objeto con informacion
}

const resetPassword = async (req, res)=>{
    //validacion
    await check('email').isEmail().withMessage('Eso no parece un email').run(req);
   
    let resultado = validationResult(req); // aca se guarda en un array los errores de las validaciones
    // validattions Result almacena los check 
   
    // validar que el resultado este vacío
    if (!resultado.isEmpty()) {
         // errores
        return res.render('auth/recuperar_pass', {
            pagina : 'Recuperar password',
            csrfToken : req.csrfToken(),
            errores : resultado.array()
        })
    }

    // si pasa la validacion 
    // Buscar el usuario, si no existe generar un mensaje de email no registrado
    const {email} = req.body
    const existeUsuario = await Usuario.findOne({ where : {email}});
    if (!existeUsuario) {
        return res.render('auth/recuperar_pass', {
            pagina : 'Recuperar password',
            csrfToken : req.csrfToken(),
            errores : [{msg : "El email no esta registrado"}]
        }) 
    }

    // si pasa la validacion se debe generar un token y enviar un email de confirmacion
    existeUsuario.token = generateID();
    await existeUsuario.save();

    // enviar un email
    emailOlvidePass({
        email : existeUsuario.email,
        nombre : existeUsuario.nombre,
        token : existeUsuario.token
    });

    // template para ingresar la nueva contraseña
    res.render('templates/mensaje', {
        pagina : "Reestablece tu password",
        mensaje : "Hemos enviado un correo con las instrucciones "
    })
}   

const comprobarToken = async(req, res) =>{
    const {token} = req.params // params es que va por la url
    const usuario = await Usuario.findOne({where : {token}})
    if (!usuario) {
        return res.render('auth/confirmar-cuenta', {
            pagina : 'Reestablece tu password',
            mensaje : "Hubo un error al validar tu información, intenta de nuevo",
            error : true
        }) 
    }

    // Mostrar formulario para cambiar su password
    res.render('auth/reset-pasword', {
        pagina : 'Reestablece tu password',
        csrfToken : req.csrfToken()
    })
}

const nuevoPassword = async (req, res) =>{
    await check('password').isLength({ min:6 }).withMessage('El password debe ser de al menos 6 caracteres').run(req);
    let resultado = validationResult(req); 

    // validar que el resultado este vacío
    if (!resultado.isEmpty()) {
        // errores
        return res.render('auth/reset-pasword', {
            pagina : 'Restablece tu password',
            csrfToken : req.csrfToken(),
            errores : resultado.array(),
        })
    }

    const {token} = req.params;
    const {password} =req.body;

    // identificar el usuario
    const usuario = await Usuario.findOne({where:{token}});

    // hashear el password
    const salt = await bcrypt.genSalt(10);
    usuario.password = await bcrypt.hash( password, salt);
    usuario.token = null;
    
    await usuario.save();
    return res.render('auth/confirmar-cuenta', {
        pagina : 'Password Reestablecido',
        mensaje : "El password se guardo correctamente"
    }) 
    
}

/** export default solo puede enviar uno */
/** export nombrados puede exportar varios */
export {
    formularioLogin,
    formularioRegistro,
    formularioRecuperarPass,
    resetPassword,
    registrar,
    confirma,
    comprobarToken,
    nuevoPassword
}
