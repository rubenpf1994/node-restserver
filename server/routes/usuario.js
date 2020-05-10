const express = require('express');
const Usuario = require('../models/usuario');
const app = express();
const bcrypt = require('bcrypt');
//Para crear registro
app.get('/usuario', (req, res) => {
    res.json('get usuario');
});

//Para crear registro
app.post('/usuario', (req, res) => {

    //Tratamos el payload de la url gracias al bodyParser
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
    /*
        if (body.nombre === undefined) {
            res.status(400).json({
                ok: false,
                mensaje: 'El nombre es necesario'
            });
        } else {
            res.json({
                body
            });
        }*/

});

//Para actaulizar datos
app.put('/usuario/:id', (req, res) => {

    let id = req.params.id;
    res.json({
        id
    });
});

//Para borrar datos
app.delete('/usuario', (req, res) => {
    res.json('eliminar usuario');
});

module.exports = app;