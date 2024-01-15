/** metodos http
 * get, post, put, pach
*/

import express from "express"; // importamos la libreria
import { formularioLogin, formularioRegistro, formularioRecuperarPass, resetPassword, registrar, confirma, comprobarToken, nuevoPassword } from "../controllers/usuarioController.js";

/* express soporte de manera nativa todos los tipos de routing */
const router = express.Router();

// routin primera manera de escuchar las peticiones con callbacks
// router.get('/', function(req, res){
//     res.json({msg:'Hola mundo con express'})
// })

// router.get('/nosotros', function(req, res){
//     res.send('Estamos mirando la vista personal')
// })

// segunda manera con arrays funcionts
// router.get('/', (req, res)=>{
//     res.json({msg : 'hola peticion de vista principal'})
// })


// manejo del template engine
router.get('/login', formularioLogin)

router.get('/registro', formularioRegistro )
router.post('/registro', registrar )
// routin dinamico con los dos puntos se especifica una variable dinamica
router.get('/confirma/:token', confirma)  // cuando el usuario da click en el enlace del correo

router.get('/recuperar_pass', formularioRecuperarPass )
router.post('/recuperar_pass', resetPassword )
// almacenar el nuevo password
router.get('/recuperar_pass/:token', comprobarToken);
router.post('/recuperar_pass/:token', nuevoPassword);




// router.post('/', (req, res)=>{
//     res.json({msg:'hola peticion con formulario'})
// })

/* ejemplo de peticiones con diferentes metodos http*/ 
// router.route('/')
//     .get(function(req, res){
//         res.json({msg : 'hola peticion de vista principal'})
//     })
//     .post(function(req, res){
//         
//     })

export default router;
