// controlador, ahora con DB, importar modelo

var models = require('../models/models.js');

// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
  models.Quiz.find(quizId).then(
    function(quiz) {
      if (quiz) {
	req.quiz = quiz;
	next();
      } else { next(new Error('No existe quizId = ' + quizId));}
    }
			   ).catch(function(error) { next(error);});
};
  

// Get /quizes/:id
exports.show = function(req, res) {
  res.render('quizes/show', { quiz: req.quiz});
};


// Get /quizes/:id/answer
exports.answer = function(req, res) {
  var resultado = 'Incorrecto';
  if (req.query.respuesta === req.quiz.respuesta){
    resultado = ' Correcto ';
  }
  res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado});
};

/*exports.index = function(req, res) {
  models.Quiz.findAll().then(function(quizes) {
    res.render('quizes/index', { quizes: quizes});
  }).catch(function(error)  {next(error);})
};*/


//buscar pregunta Get 
exports.index = function(req, res) {
  var buscar = ("%" + req.query.search + "%").replace(/ /g, '%');
  
  if(req.query.search) {
    models.Quiz.findAll({
      where: ["upper(pregunta) like ?", buscar.toUpperCase()], 
			order: [['pregunta',  'ASC']]}
		       ).then(function(quizes) {
			 res.render('quizes/index', { quizes: quizes});
			}).catch(function(error)  {next(error);})
    
  }else {
    models.Quiz.findAll().then(
        function(quizes) {
        res.render('quizes/index', { quizes: quizes});
        }
      ).catch(function(error){ next(error); })
	  }
};



// get /quizes/creditos/author
exports.author = function(req, res) {
  res.render('quizes/creditos/author', {autor: 'Autor: '});
};