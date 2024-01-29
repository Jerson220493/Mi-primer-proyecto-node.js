import {validationResult} from 'express-validator';
import Precio from '../models/Precio.js';
import Categoria from '../models/Categoria.js';

const admin = (req, res) => {
    res.render('propiedades/admin',{
        pagina : "Mis propiedades",
        barra : true
    })
}

const crear = async (req, res) => {

    // consultar modelo de precio y categoria
    const [categorias, precios] = await Promise.all([
        Categoria.findAll(),
        Precio. findAll()
    ])

    res.render('propiedades/crear', {
        pagina : 'crear propiedad',
        barra : true,
        csrfToken : req.csrfToken(),
        categorias,
        precios,
        datos : {}
    })
}

const guardar = async (req, res) => {
    // validacion 
    let resultado = validationResult(req);
    if (!resultado.isEmpty()) {
        const [categorias, precios] = await Promise.all([
            Categoria.findAll(),
            Precio. findAll()
        ])
        console.log(req.body)
        return res.render('propiedades/crear', {
            pagina : 'crear propiedad',
            barra : true,
            csrfToken : req.csrfToken(),
            categorias,
            precios,
            errores : resultado.array(),
            datos : req.body
        })
    }
}

export {
    admin,
    crear,
    guardar
}