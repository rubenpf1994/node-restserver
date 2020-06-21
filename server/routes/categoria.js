const express = require('express');

let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');
const _ = require('underscore');
//=====================
// Mostrar todas las categorias
//===================
app.get('/categoria', verificaToken, (req, res) => {
    Categoria.find()
        //Nombre de la colecion a mostrar, campos a mostrar
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(404).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                categorias
            });
        });
});
//=====================
// Mostrar una categoria por ID
//===================
app.get('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Categoria.findOne({ _id: id }, (err, categoriaDB) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El ID no es correcto'
                }
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

//=====================
// Crear nueva categoria
//===================
app.post('/categoria', verificaToken, (req, res) => {
    //regresa la nueva categoria
    //req.usuario._id
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

//=====================
// Actualizar categoria por ID
//===================
app.put('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;
    let usuario = req.usuario._id;
    //Array con los campos permitidos a actualizar
    let body = _.pick(req.body, ['descripcion']);
    //let body = req.body;
    Categoria.findOneAndUpdate(id, body, { new: true, runValidators: true }, (err, categoriaBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaBD
        });

    });
});

//=====================
// Borrar categoria por ID
//===================
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    //Solo un administrador puede borrar una categoria
    let id = req.params.id;
    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        //En caso de no encontrar el usuario pero no saltar error
        if (!categoriaBorrada) {
            return res.status(400).json({
                ok: false,
                err: {
                    mensaje: 'El ID no existe'
                }
            });
        }
        res.json({
            ok: true,
            categoria: categoriaBorrada
        });
    });
});

module.exports = app;