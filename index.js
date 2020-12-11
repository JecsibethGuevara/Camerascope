const express = require('express');
const morgan = require('morgan');
const handlebars = require('express-handlebars');
const path = require('path');
const passport = require('passport')
const session = require('express-session')
const sqlite3 = require('sqlite3').verbose();
const url = require ('url')
const bodyParser = require('body-parser');
const docx = require("docx");

//Inicializar 
const { BrowserWindow, app} = require('electron')
const win =  express();
const rutas = require('../app/src/routes/routes')
//const rutas = require('./routes/routes')

win.use(bodyParser.json({limit: '50mb'}));
win.use(bodyParser.urlencoded({limit: '50mb', extended: true}));


win.set('port', process.env.PORT || 5000); // configuracion del puerto
win.set('views', path.join(__dirname, '/src/views'));
//win.set('views', path.join(__dirname, '/views')); // configuracion de la carpeta views (ubicacion)
win.engine('.hbs', handlebars({ // tipo de views config
    defaultLayout: 'main', // el archivo
    layoutsDir: path.join(win.get('views'), 'layouts'),
    extname: '.hbs'
}));


win.set('view engine', '.hbs');

//middlewares

win.use(morgan('dev'));
win.use(express.urlencoded({extended: false}));
win.use(express.json());

//variables globales
win.use((req, res, next) =>{

    next();
});

//rutas 
win.use('/', rutas);

//public
win.use(express.static(path.join(__dirname, '/src/public')));
//win.use(express.static(path.join(__dirname, 'public')));
//start server
win.listen(win.get('port'), () =>{
    console.log('server on port', win.get('port'));
})

let mainWindow = null

function main() {
  mainWindow = new BrowserWindow({
    width: 1000,
    heigth: 900 
  })
  mainWindow.removeMenu()
  mainWindow.loadURL('http://localhost:5000/')
}
app.on('ready', main)