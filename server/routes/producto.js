const express = require('express');

const { verificaToken } = require('../middlewares/autenticacion');

let app = express();

let Producto = require('../models/producto');
const _ = require('underscore');

//=====================
// Mostrar todos los productos
//===================
app.get('/productos', verificaToken, (req, res) => {
    let desde = Number(req.query.desde) || 0;
    let hasta = Number(req.query.hasta) || 5;

    Producto.find()
        //Nombre de la colecion a mostrar, campos a mostrar
        .populate('usuario')
        .populate('categoria')
        .skip(desde)
        .limit(hasta)
        .exec((err, productos) => {
            if (err) {
                return res.status(404).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productos
            });
        });
});
//=====================
// Mostrar un producto por ID
//===================
app.get('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Producto.find({ _id: id })
        .exec((err, productosDB) => {
            if (err) {
                return res.status(401).json({
                    ok: false,
                    err
                });
            }
            if (!productosDB) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'El ID no es correcto'
                    }
                });
            }
            res.json({
                ok: true,
                producto: productosDB
            });
        });
});

//=================
// Buscar productos
//====================
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(401).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productos
            });
        });
});

//=====================
// Crear un nuevo producto
//===================
app.post('/productos', verificaToken, (req, res) => {
    //regresa la nueva categoria
    //req.usuario._id
    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    Producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            producto: productoDB
        });
    });
});

//=====================
// Actualizar `produtco` por ID
//===================
app.put('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    //Array con los campos permitidos a actualizar
    let body = req.body;
    //let body = req.body;
    Producto.findOneAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            producto: productoDB
        });

    });
});

//=====================
// Borrar producto por ID
//===================
app.delete('/productos/:id', verificaToken, (req, res) => {
    //Solo un administrador puede borrar una categoria
    let id = req.params.id;

    Producto.findByIdAndRemove(id, (err, productoBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        //En caso de no encontrar el usuario pero no saltar error
        if (!productoBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    mensaje: 'El ID no existe'
                }
            });
        }
        res.json({
            ok: true,
            producto: productoBorrado
        });
    });
});

module.exports = app;