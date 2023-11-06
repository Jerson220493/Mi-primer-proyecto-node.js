
const formularioLogin = (req, res)=>{
    res.render('auth/login', {

    }) // render es el metodo para imprimir un template engine, como segundo parametros se puede pasar un objeto con informacion
}

const formularioRegistro = (req, res)=>{
    res.render('auth/registro', {
        
    }) // render es el metodo para imprimir un template engine, como segundo parametros se puede pasar un objeto con informacion
}

/** export default solo puede enviar uno */
/** export nombrados puede exportar varios */
export {
    formularioLogin,
    formularioRegistro
}
