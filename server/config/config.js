//===============================
// Puerto
//=============================
process.env.PORT = process.env.PORT || 3000;

//===========================
//  Entorno
//===========================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//============================
// Base de datos
//===========================

let urlDB;
if(process.env.NODE_ENV==='dev'){
  urlDB = 'mongodb://localhost:27017/cafe';
}else{
  //Url de la conexion a la base de datos de produccion
  urlDB ='';
}

process.env.URL_DB = urlDB;
