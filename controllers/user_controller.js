// Ahora el método autenticar busca al user en laDB y verifica psw
/*var users ={
  admin: {id:1, username:"admin", password:"1234"},
  pepe:  {id:2, username:"pepe",  password:"5678"}
};*/

var models = require('../models/models.js');

// MW que permite acciones solamente si el quiz objeto pertenece al usuario logeado o  a la cuenta del administrador
exports.ownershipRequired = function(req, res, next) {
  var objUser = req.user.id;
  var logUser = req.session.user.id;
  var isAdmin = req.session.user.isAdmin;
  
  if (isAdmin || objUser === logUser) {
    next();
  } else {
    res.redirect('/');
  }
};

// Autiload : userId
exports.load = function(req, res, next, userId) {
  models.User.find({where: {id: Number(userId)}})
  .then(function(user) {
    if (user) {
      req.user = user;
      next();
    } else {next(new Error('No existe userId = ' + userId))}
  }).catch(function(error) {next(error)});
};


// Comprueba si el ususario esta registrado en users
// Si autenticación fall o hay errores se ejecuta callback(error).
exports.autenticar = function(login, password, callback) {
  console.log(" login  " + login + "  password "+password);
  /*
  if(users[login]) {
    if(password === users[login].password){
      callback(null, users[login]);
    }
    */
  models.User.find({
    where: {
      username: login
    }
  }).then(function(user) {
    if (user) {
      if(user.verifyPassword(password)){
	callback(null, user);
      }
      else { callback(new Error('Password erróneo. ')); }
    } else { callback(new Error('No existe user = '+login))}
  }).catch(function(error) {callback(error)});
};

// GET/ user/:id /edit
exports.edit = function(req, res) {
  res.render('user/edit', { user: req.user, errors: []});
};  //req.user: instancia de user cargada con autoload

// PUT /user/:id
exports.update = function(req, res, next) {
  req.user.username = req.body.user.username;
  req.user.password = req.body.user.password;
  
  req.user
  .validate()
  .then(
    function(err) {
      if (err) {
	res,render('user/' + req.user.id, {user: req.user, errors: err.errors});
      } else {
	req.user   //save: guarda campos username y password en BD
	.save( {fields: ["username", "password"]})
	.then( function(){res.redirect('/');});
      }    //redirección HTTP a /
    }).catch(function(error) {next(error)});
};

// GET / user
exports.new = function(req, res) {
  var user = models.User.build( // crea objeto user
  {username: "", password: ""}
			 );
  res.render('user/new', { user: user, errors: []});
};

// POST / user
exports.create = function(req, res) {
  var user = models.User.build( req.body.user);
  
  user
  .validate()
  .then(
    function(err) {
      if (err) {
	res,render('user/new', {user: user, errors: err.errors});
      } else {
	user   //save: guarda campos username y password en BD de user
	.save( {fields: ["username", "password"]})
	.then( function(){
	  // crea la sesión de usuario ya autenticado y la redirige a /
	  req.session.user = {id: user.id, username:user.username};
	  res.redirect('/');
	});
      }
    }).catch(function(error){next(error)});
};

// DELETE / user/:id
//exports,destroy = function(req, res) {
exports.delete = function(req, res) {
  req.user.destroy().then(function() {
    // borra la sesión y redirige a /
    delete req.session.user;
    res.redirect('/');
  }).catch(function(error){next(error)});
};
  
    