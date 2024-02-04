import {validationResult} from 'express-validator';
import {Precio, Categoria, Propiedad} from '../models/index.js';


const admin = (req, res) => {
    res.render('propiedades/admin',{
        pagina : "Mis propiedades",
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
        return res.render('propiedades/crear', {
            pagina : 'crear propiedad',
            csrfToken : req.csrfToken(),
            categorias,
            precios,
            errores : resultado.array(),
            datos : req.body
        })
    }

    const {titulo, descripcion, habitaciones, estacionamiento, wc, calle, lat, lng, precio, categoria}  = req.body;
    const {id: usuarioId} = req.usuario;
    try {
        const propiedadGuardada = await Propiedad.create({
            titulo,
            descripcion,
            habitaciones,
            estacionamiento,
            wc,
            calle,
            lat,
            lng,
            precioId : precio,
            categoriaId : categoria,
            usuarioId,
            imagen : ''
        });

        const { id } = propiedadGuardada

        res.redirect(`/propiedades/agregar-imagen/${id}`)

    } catch (error) {
        
    }
}

const agregarImagen = async (req, res) => {

    const {id} = req.params

    // validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id)
    if (!propiedad) {
        return res.redirect('/mis-propiedades')
    }

    // validar que la propiedad no este duplicada
    if (propiedad.publicado) {
        return res.redirect('/mis-propiedades')
    }

    // validar que la propiedad sea del usaurio
    if (propiedad.usuarioId.toString() !== req.usuario.id.toString()) {
        return res.redirect('/mis-propiedades');
    }

    res.render('propiedades/agregar-imagen',{
        pagina : `Agregar Imagen: ${propiedad.titulo}`,
        csrfToken : req.csrfToken(),
        propiedad
    })
}

export {
    admin,
    crear,
    guardar,
    agregarImagen
}