require('./config/config')
const express = require('express');
const app = express();

const bodyParser = require('body-parser');

//Procesará cualquier payload que reciba la url
app.use(bodyParser.urlencoded({ extended: false }));
//parse application/json
app.use(bodyParser.json());

const port = process.env.port || 8080;

app.get('/', (req, res) => {
    res.json('Hello world');
});

//Para crear registro
app.get('/usuario', (req, res) => {
    res.json('get usuario');
});

//Para crear registro
app.post('/usuario', (req, res) => {

    //Tratamos el payload de la url gracias al bodyParser
    let body = req.body;
    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: 'El nombre es necesario'
        });
    } else {
        res.json({
            body
        });
    }

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

app.listen(process.env.PORT, () => {
    console.log(`Escuchando puerto ${process.env.PORT}`);
});