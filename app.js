var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');

var routes = require('./routes/index');
//var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(partials());

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
//app.use(express.favicon(__dirname + '/public/favicon1.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());

//app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded());
app.use(cookieParser('Quiz 2015')); //semilla para cifrar cookie
//app.use(cookieParser()); 
app.use(session());  // instalar MV session
/*
app.use(session({
  secret:'Quiz 2015',
  resave: false,
  saveUninitialized: true
}));
*/
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

//require ('./routes/session')(app);

// auto-logout de sesión
// expirar sesión tras dos minutos inactivos  o 120000 milisegundos
app.use(function (req, res, next) {
  var tiempo = 120000;
  var now = new Date().getTime(); //fecha actual
  
  if(req.session.user && req.session.lastAccess) {
    var lifetime = now - req.session.lastAccess;
    console.log("tiempo de vida: "+lifetime);
    if(tiempo<= lifetime){
      req.session.destroy();
      //delete req.sesion.user;
      res.redirect('/login');
      //return;
    } 
  }
  req.session.lastAccess = now;
  
  // Hacer visible req.session en las vistas
  //res.locals.session = req.sesion;
  next();
});

//copia la sesión que está accesible en req.session en res.locals.sesion para las vistas
// guarda la ruta de cada solicitud HTTP en session.editos para redirteccionar, después de login o logout

// Helpers dinamicos:
app.use(function(req, res, next) {

  // si no existe lo inicializa
  if (!req.session.redir) {
    req.session.redir = '/';
  }
  // guardar path en session.redir para despues de login
  if (!req.path.match(/\/login|\/logout|\/user/)) {
    req.session.redir = req.path;
  }

  // Hacer visible req.session en las vistas
  res.locals.session = req.session;
  next();
});


app.use('/', routes);
//app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
	    errors: []
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        errors: []
    });
});



module.exports = app;
