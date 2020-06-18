require('./config/config')
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

//Procesará cualquier payload que reciba la url
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

//parse application/json
app.use(bodyParser.json());

//COndiguracion global de rutas
app.use(require('./routes/index'));


//Habilitar la carpeta 'public' 
app.use(express.static(path.resolve(__dirname, '../public')));

const connOptions = {
    useFindAndModify: false,
    useUnifiedTopology: true,
    useNewUrlParser: true
}
mongoose.set('useCreateIndex', true);
mongoose.connect(process.env.URL_DB, connOptions, (err, res) => {
    if (err) throw err;
    console.log('Online');
});

app.listen(process.env.PORT, () => {
    console.log(`Escuchando puerto ${process.env.PORT}`);
});