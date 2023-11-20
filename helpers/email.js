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
        `
    })
}

export {emailRegistro}
