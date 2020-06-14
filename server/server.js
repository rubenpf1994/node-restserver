require('./config/config')
const express = require('express');
const mongoose = require('mongoose');
const app = express();

const bodyParser = require('body-parser');

//Procesará cualquier payload que reciba la url
app.use(bodyParser.urlencoded({ extended: false }));
//parse application/json
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.json('Hello world');
});

app.use(require('./routes/usuario'));




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
