/** metodos http
 * get, post, put, pach
*/

import express from "express"; // importamos la libreria
import { formularioLogin, formularioRegistro, formularioRecuperarPass, registrar, confirma } from "../controllers/usuarioController.js";


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
router.get('/recuperar_pass', formularioRecuperarPass )
router.get('/confirma/:token', confirma)


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
