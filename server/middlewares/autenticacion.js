const jwt = require('jsonwebtoken');

//
// Verificar token
//

let verificaToken = (req, res, next) => {

    let token = req.get('token'); //Llama al nombre del token en el header de la peticion

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }

        //El payload se ve contenido en el 'decoded'. Accedemos al usuario mediente este
        req.usuario = decoded.usuario;
        next();
    });

};

//=================
// Verifica AdminRole
//=================

let verificaAdmin_Role = (req, res, next) => {
    let usuario = req.usuario;
    console.log(usuario);
    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }


};

module.exports = {
    verificaToken,
    verificaAdmin_Role
}