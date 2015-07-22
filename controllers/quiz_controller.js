// controlador, ahora con DB, importar modelo

var models = require('../models/models.js');

// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
  models.Quiz.find({
      where: {id: Number(quizId)},
      include: [{model: models.Comment}]
  }).then(function(quiz) {
      if (quiz) {
	req.quiz = quiz;
	next();
      } else { next(new Error('No existe quizId = ' + quizId));}
    }
			   ).catch(function(error) { next(error);});
};
  

// Get /quizes/:id
exports.show = function(req, res) {
  res.render('quizes/show', { quiz: req.quiz, errors: []});
};


// Get /quizes/:id/answer
exports.answer = function(req, res) {
  var resultado = 'Incorrecto';
  if (req.query.respuesta === req.quiz.respuesta){
    resultado = ' Correcto ';
  }
  res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado, errors: []});
};

// GET /quizes
/*
exports.index = function(req, res) {
  models.Quiz.findAll().then(function(quizes) {
    res.render('quizes/index', { quizes: quizes, errors: []});
  }).catch(function(error)  {next(error);})
};
*/

//buscar pregunta Get 
exports.index = function(req, res) {
  var buscar = ("%" + req.query.search + "%").replace(/ /g, '%');
  
  if(req.query.search) {
    models.Quiz.findAll({
      where: ["upper(pregunta) like ?", buscar.toUpperCase()], 
			order: [['pregunta',  'ASC']]}
		       ).then(function(quizes) {
			 res.render('quizes/index', { quizes: quizes, errors: []});
			}).catch(function(error)  {next(error);})
    
  }else {
    models.Quiz.findAll().then(
        function(quizes) {
        res.render('quizes/index', { quizes: quizes, errors: []});
        }
      ).catch(function(error){ next(error); })
	  }
};

//GET /quizes/new
exports.new = function(req, res) {
  var quiz = models.Quiz.build( //crea objeto quiz
    {pregunta: "Pregunta", respuesta: "Respuesta", tema: "Tema"}
			 );
  res.render('quizes/new', {quiz: quiz, errors: []});
};

//POST /quizes/create
exports.create = function(req, res) {
  var quiz = models.Quiz.build( req.body.quiz );
  
  //guarda en DB los campos pregunta y respuesta de quiz
 // var errors = quiz.validate(); //porque no funciona con then (objeto no tiene then)
  
  //Cambiada sequelize a la versión 2.0.0
  
  quiz.validate().then(
    function(err){
      if(err) {
	res.render('quizes/new', {quiz:quiz, errors: err.errors});
	
    /*
     * // if(errors) {
    var i= 0;
    var errores = new Array(); //array de errores, vacia []
    for(var prop in errors) errores[i++] = {message: errors[prop]};
    res.render('quizes/new', {quiz:quiz, errors: errores});
  */
    } else {
      quiz.save({fields: ["pregunta", "respuesta", "tema"]})
      .then(function(){
	res.redirect('/quizes')});
      } //Redirección HTTP (URL relativo) lista preguntas
    });
};

//get / quizes/:id/edit
exports.edit = function(req, res) {
  var quiz = req.quiz; //autoload de instancia quid
  
  res.render('quizes/edit', {quiz: quiz, errors: []});
};

//PUT /quizes/:id
exports.update = function(req, res) {
  req.quiz.pregunta = req.body.quiz.pregunta;
  req.quiz.respuesta = req.body.quiz.respuesta;
  req.quiz.tema = req.body.quiz.tema;
  
  req.quiz
  .validate()
  .then(
    function(err) {
      if(err) {
	
	res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
      } else {
	req.quiz    //save, guarda los campos pregunta, respuesta en DB y tema
	.save( {fields: ["pregunta", "respuesta", "tema"]})
	.then( function() { res.redirect('/quizes');});
      }   //redirección HTTO a lista de preguntas ( URL relativo)
    });
};

// DELETE /quizes/ :id
//exports.detroy = function(req, res) {
exports.delete = function(req, res) {
  req.quiz.destroy().then( function() {
    res.redirect('/quizes');
  }).catch(function(error) {next(error)});
};
      



// get /quizes/creditos/author
exports.author = function(req, res) {
  res.render('quizes/creditos/author', {autor: 'Autor: ', errors: []});
};