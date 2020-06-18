//===============================
// Puerto
//=============================
process.env.PORT = process.env.PORT || 3000;

//===========================
//  Entorno
//===========================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//============================
// Seed de autentificacion
//===========================
process.env.SEED = process.env.SEED || 'este-ese-el-seed-desarrollo';
//============================
// Vencimiento de token
//===========================
//60 segundos
//60 minutos
//24 horas
//30 dias

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

//============================
// Base de datos
//===========================

let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    //Url de la conexion a la base de datos de produccion
    urlDB = '';
}
process.env.URL_DB = urlDB;

//=================
// Google Client ID
//==================
process.env.CLIENT_ID = process.env.CLIENT_ID || "813453154449-rpqolf1d55cjrt8dcg8nojq35ismf725.apps.googleusercontent.com";