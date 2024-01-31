
const protegerRuta = async(req, res, next) => {
    console.log('desde el middleware')
    next();
}

export default protegerRuta;
