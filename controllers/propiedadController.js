import { unlink } from 'node:fs/promises'
import {validationResult} from 'express-validator';
import {Precio, Categoria, Propiedad, Mensaje, Usuario} from '../models/index.js';
import {esVendedor, formatearFecha} from "../helpers/index.js";


const admin = async (req, res) => {

    // leer el query string
    // console.log(req.query.pagina)
    const { pagina : paginaActual } = req.query;

    // expresion regular
    // el simbolo exponente significa que tiene que empezar con el caracter
    // el simbolo dolar significa que tiene que tiene que terminar con el caracter final de los corchetes
    const expresion =  /^[1-9]$/;
    if (!expresion.test(paginaActual)) {
        return res.redirect('/mis-propiedades?pagina=1')
    }

    try {
        const { id } = req.usuario

        // limites y offset para el paginador 
        const limite = 5;
        const offset = (paginaActual*limite) - limite;

        const [propiedades, total] = await Promise.all([
            Propiedad.findAll({
                limit : limite,
                offset,
                where:{
                    usuarioId : id
                },
                include : [
                    { model : Categoria, as: 'categoria' },
                    { model : Precio, as: 'precio'},
                    { model : Mensaje, as: 'mensajes'}
                ]
            }),
            Propiedad.count({
                where : {
                    usuarioId : id
                }
            })
        ])

        res.render('propiedades/admin',{
            pagina : "Mis propiedades",
            propiedades,
            csrfToken : req.csrfToken(),
            paginas : Math.ceil(total/limite),
            paginaActual : Number(paginaActual),
            total,
            offset,
            limite
        })
    } catch (error) {
        console.log(error)
    }
    
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

// funcion para almacenar las imagenes
const almacenarImagen = async (req, res, next) => {
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

    try {
        // almacenar la imagen y publicar la propiedad
        propiedad.imagen = req.file.filename;
        propiedad.publicado = 1;
        await propiedad.save();
        next();
    } catch (error) {
        console.log(error)
    }

}

const editar = async(req, res) =>{

    const {id} = req.params;

    const propiedad = await Propiedad.findByPk(id)

    // validar que exista la propiedad
    if (!propiedad) {
        return res.redirect('/mis-propiedades');
    }

    // revisar que quien visita la url sea el propietario
    if (propiedad.usuarioId.toString() !== req.usuario.id.toString()) {
        return res.redirect('/mis-propiedades');
    }

    // consultar modelo de precio y categoria
    const [categorias, precios] = await Promise.all([
        Categoria.findAll(),
        Precio. findAll()
    ])

    res.render('propiedades/editar', {
        pagina : 'editar propiedad',
        csrfToken : req.csrfToken(),
        categorias,
        precios,
        datos : propiedad
    })
}

const guardarCambios = async(req, res) => {

    // verificar la validacion 
    let resultado = validationResult(req);
    if (!resultado.isEmpty()) {
        const [categorias, precios] = await Promise.all([
            Categoria.findAll(),
            Precio. findAll()
        ])
        console.log(req.body)
        return res.render('propiedades/editar', {
            pagina : 'editar propiedad',
            csrfToken : req.csrfToken(),
            categorias,
            precios,
            datos : req.body,
            errores : resultado.array()
        })
    }

    const {id} = req.params;

    const propiedad = await Propiedad.findByPk(id)

    // validar que exista la propiedad
    if (!propiedad) {
        return res.redirect('/mis-propiedades');
    }

    // revisar que quien visita la url sea el propietario
    if (propiedad.usuarioId.toString() !== req.usuario.id.toString()) {
        return res.redirect('/mis-propiedades');
    }

    // Reescribir el objeto y actualizar
    try {
        const {titulo, descripcion, habitaciones, estacionamiento, wc, calle, lat, lng, precio: precioId, categoria: categoriaId}  = req.body;
        propiedad.set({
            titulo,
            descripcion,
            habitaciones,
            estacionamiento,
            wc,
            calle,
            lat,
            lng,
            precioId,
            categoriaId
        })

        await propiedad.save();
        return res.redirect('/mis-propiedades');

    } catch (error) {
        console.log(error)
    }

}

const eliminar = async(req, res) => {

    const {id} = req.params;

    const propiedad = await Propiedad.findByPk(id)

    // validar que exista la propiedad
    if (!propiedad) {
        return res.redirect('/mis-propiedades');
    }

    // revisar que quien visita la url sea el propietario
    if (propiedad.usuarioId.toString() !== req.usuario.id.toString()) {
        return res.redirect('/mis-propiedades');
    }

    // eliminar la imagen
    await unlink(`public/uploads/${propiedad.imagen}`)

    // eliminar la propiedad
    await propiedad.destroy();
    res.redirect('/mis-propiedades');
}

// modificar el estado de una propiedad
const cambiarEstado = async(req, res) => {
    const {id} = req.params;

    const propiedad = await Propiedad.findByPk(id)

    // validar que exista la propiedad
    if (!propiedad) {
        return res.redirect('/mis-propiedades');
    }

    // revisar que quien visita la url sea el propietario
    if (propiedad.usuarioId.toString() !== req.usuario.id.toString()) {
        return res.redirect('/mis-propiedades');
    }

    // ACTUALIZAR
    propiedad.publicado = !propiedad.publicado

    await propiedad.save()

    res.json({
        resultado : true
    })
}

// muestra una propiedad
const mostrarPropiedad = async(req, res) => {
    const {id} = req.params;

    const propiedad = await Propiedad.findByPk( id, {
        include : [
            { model : Categoria, as: 'categoria' },
            { model : Precio, as: 'precio'}
        ]
    })
    // console.log(propiedad)
    // validar que exista la propiedad
    if (!propiedad || !propiedad.publicado) {
        return res.redirect('/404');
    }

    res.render('propiedades/mostrar', {
        propiedad,
        pagina : propiedad.titulo,
        csrfToken : req.csrfToken(),
        usuario : req.usuario,
        esVendedor : esVendedor(req.usuario?.id, propiedad.usuarioId)
    })
}

const enviarMensaje = async(req, res) => {
    const {id} = req.params;
    // console.log(id)
    const propiedad = await Propiedad.findByPk( id, {
        include : [
            { model : Categoria, as: 'categoria' },
            { model : Precio, as: 'precio'}
        ]
    })
    // console.log(propiedad)

    // validar que exista la propiedad
    if (!propiedad) {
        return res.redirect('/404');
    }

    // renderizar los errores
    // validacion 
    let resultado = validationResult(req);
    if (!resultado.isEmpty()) {
        return  res.render('propiedades/mostrar', {
            propiedad,
            pagina : propiedad.titulo,
            csrfToken : req.csrfToken(),
            usuario : req.usuario,
            esVendedor : esVendedor(req.usuario?.id, propiedad.usuarioId),
            errores : resultado.array()
        })
    }

    const {mensaje} = req.body;
    const {id:propiedadId} = req.params;
    const {id:usuarioId} = req.usuario;

    await Mensaje.create({
        mensaje,
        propiedadId,
        usuarioId
    })

    // res.render('propiedades/mostrar', {
    //     propiedad,
    //     pagina : propiedad.titulo,
    //     csrfToken : req.csrfToken(),
    //     usuario : req.usuario,
    //     esVendedor : esVendedor(req.usuario?.id, propiedad.usuarioId),
    //     enviado : true
    // })
    res.redirect('/');
}

const verMensajes = async(req, res) => {
    const {id} = req.params;

    const propiedad = await Propiedad.findByPk(id, {
        include : [
            { model : Mensaje, as: 'mensajes',
                include : [
                    {model : Usuario.scope('eliminarPassword'), as: 'usuario'}
                ]
            }
        ]
    })

    // validar que exista la propiedad
    if (!propiedad) {
        return res.redirect('/mis-propiedades');
    }

    // revisar que quien visita la url sea el propietario
    if (propiedad.usuarioId.toString() !== req.usuario.id.toString()) {
        return res.redirect('/mis-propiedades');
    }

    res.render('propiedades/mensajes',{
        pagina : 'Mensajes',
        mensajes : propiedad.mensajes,
        formatearFecha 
    })
}

export {
    admin,
    crear,
    guardar,
    agregarImagen,
    almacenarImagen,
    editar,
    guardarCambios,
    eliminar,
    cambiarEstado,
    mostrarPropiedad,
    enviarMensaje,
    verMensajes
}