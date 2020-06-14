const express = require('express');
const Usuario = require('../models/usuario');
const app = express();
const bcrypt = require('bcrypt');
const _ = require('underscore');


//Para crear registro
app.get('/usuario', (req, res) => {

    let desde = Number(req.query.desde) || 0;
    let hasta = Number(req.query.hasta) || 5;

    let condicionUsuario={
      estado: true
    }

    Usuario.find(condicionUsuario, 'nombre email') //Para filtrar por campos
        .skip(desde)
        .limit(hasta)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.countDocuments(condicionUsuario, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                });
            });

        });
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
    //Array con los campos permitidos a actualizar
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);
    //let body = req.body;
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioBD
        });

    });
});

//Para borrar datos
app.delete('/usuario/:id', (req, res) => {
    let id = req.params.id;
    console.log(id);
    //Usuario.findByIdAndRemove(id, (err, usuarioBorrado)=>{
    //Para invalidar al usuario pero no borrarlo:
    let cambiaEstado = {
      estado: false
    };
    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true}, (err, usuarioBorrado) => {
      if (err) {
          return res.status(400).json({
              ok: false,
              err
          });
      }
      //En caso de no encontrar el usuario pero no saltar error
      if (!usuarioBorrado) {
          return res.status(400).json({
              ok: false,
              err: {
                mensaje: 'Usuario no encontrado'
              }
          });
      }
      res.json({
        ok: true,
        usuario: usuarioBorrado
      });
    });
});

module.exports = app;
