import nodemailer from "nodemailer";

const emailRegistro = async (datos) =>{
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    });

    const {nombre, email, token} = datos;

    await transport.sendMail({
        from :"BienesRaices.com",
        to : email,
        subject  : "Confirma tu cuenta en bienesRaices.com",
        text : "Confirma tu cuenta en bienesRaices.com",
        html : `
                <p> Hola ${nombre}, comprueba tu cuenta en bienesRaices.com </p>

                <p> Tu cuenta ya esta lista, solo debes confirmarla en el siguiente enlace:
                    <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirma/${token}">Confirmar cuenta</a>
                </p>

                <p> Si tu no creaste esta cuenta omite este correo  </p>
        `
    })
}

const emailOlvidePass = async (datos) =>{
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    });

    const {nombre, email, token} = datos;

    await transport.sendMail({
        from :"BienesRaices.com",
        to : email,
        subject  : "Reestablece tu acceso en bienesRaices.com",
        text : "Reestablece tu acceso en bienesRaices.com",
        html : `
                <p> Hola ${nombre}, has solicitado reestablecer tu password en bienesRaices.com </p>

                <p> Sigue el siguiente enlace para generar un password nuevo:
                    <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/recuperar_pass/${token}">Confirmar Cambio</a>
                </p>

                <p> Si tu no solicitaste un cambio de password omite este correo  </p>
        `
    })
}

export {
    emailRegistro,
    emailOlvidePass
}
