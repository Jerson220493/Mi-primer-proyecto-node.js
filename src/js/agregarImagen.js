import { Dropzone } from "dropzone";

const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')

Dropzone.options.imagen = {
    dictDefaultMessage : 'Sube tus imágenes',
    acceptedFiles : '.png,.jpg,.pjeg',
    maxFilesize : 5,
    maxFiles: 1,
    paralleUploads : 1,
    autoProcessQueue : false,
    addRemoveLinks : true,
    dictRemoveFile : 'Borrar archivo',
    dictMaxFilesExceeded : 'El limite es 1 archivo',
    headers : {
        'CSRF-Token' : token
    },
    paramName : 'imagen'
}