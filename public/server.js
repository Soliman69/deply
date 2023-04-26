// importar el modulo de "express" de la carpeta "node_modules"
const express = require('express');

// Creamos un objeto "app" a traves del modulo (clase) de express
const app = new express();
// puerto por el que el servidor local escucha. "http://localhost:3000"
const port = process.env.PORT || 3000;

// DATABASE
// importamos modulo de mysql
const mysql = require('mysql2');
const pool = mysql.createPool({
  host: process.env.HOST || 'localhost',
  user: process.env.USER || 'root',
  password: process.env.PASSWORD || '',
  database: process.env.NAME || 'proyecto',
  port: process.env.PORT || 3306,
  connectionLimit: 10
});

pool.getConnection((err) => {
  if (err) {
    console.log("Error en la conexion a la DB: error->", err);
  } else {
    console.log("Conexion a la DB correcta!");
  }
});

// MIDDLEWARES
// middleware que gestiona los mensajes JSON
app.use(express.json());
// middleware que configura el directorio de los archivos estáticos (img, css, js....)
app.use(express.static('public'));

// rutas: Se establecen las rutas configuradas para este server, mediante los métodos GET, POST, PUT, DELETE.
// Estos métodos gestionan las peticiones (req) y respuestas (res) mediante un callback
// Ruta 1- En este caso devuelve al cliente un texto plano "Hello World!"
app.get('/hello_world', (req, res) => {
  res.send('Hello World !')
});
// Ruta 2- En este caso devuelve al cliente un archivo html
// __dirname: ruta absoluta del server donde se alberga el proyecto
// ESTA RUTA LA UTILIZAMOS PARA EL ENVÍO DEL FORM AL CLIENTE
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html')
});

// RUTA QUE RECOGE EL DATO DEL FORM DEL CLIENTE
app.post('/dato', (req, res) => {
  const dato = req.body.dato;
  // INSERTAR EL DATO EN LA DATABASE
  const sql = "insert into dato values(default,'" + dato + "');";
  console.log(sql);
  pool.query(sql, function (err, result) {
    if (err) {
      res.json("Ha ocurrido un error en la inserción del dato");
    } else {
      res.json("Dato insertado en la DB OK!!!");
    }
  });
});


// Crea el webserver y escucha por el puerto 3000, devolviendo un mensaje por consola
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});



