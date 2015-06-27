// controlador, ahora con DB, importar modelo

var models = require('../models/models.js');

// Get /quizes/question
exports.question = function(req, res) {
  //añadimo findAll() para buscar el array de la tabla Quiz
  models.Quiz.findAll().success(function(quiz) {
    //res.render('quizes/question', {pregunta: ' Capital de Italia '});
    res.render('quizes/question', {pregunta: quiz[0].pregunta });
    })
};


// Get /quizes/answer
exports.answer = function(req, res) {
  models.Quiz.findAll().success(function(quiz) {
    if (req.query.respuesta === quiz[0].respuesta){
      res.render('quizes/answer', {respuesta: ' Correcto '});
  } else {
    res.render('quizes/answer', {respuesta: ' Incorrecto '});
  }
  })
};

// get /quizes/creditos/author
exports.author = function(req, res) {
  res.render('quizes/creditos/author', {autor: 'Autor: '});
};