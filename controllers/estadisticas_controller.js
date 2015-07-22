// controlador, 
var models = require('../models/models.js');

/*
	    El número de preguntas
	    El número de comentarios totales
	    El número medio de comentarios por pregunta
	    El número de preguntas sin comentarios
	    El número de preguntas con comentarios
	
	*/

//Consultar estadísticas
exports.estadisticas = function(req, res) {
  var  estadio = {
    totalPreguntas:0,
    totalComentarios:0,
    mediaComentarioPregunta:0,
    preguntasSinComentario:0,
    preguntasConComentario:0
  };
  
  //total preguntas  
  models.Quiz.count().then(function(questionsNu){
    estadio.totalPreguntas = questionsNu;
    
    //total comentarios
    models.Comment.count().then(function(commentsNu) {
      estadio.totalComentarios = commentsNu;
      estadio.mediaComentarioPregunta = estadio.totalComentarios / estadio.totalPreguntas;
      
      //Preguntas con comentarios
      models.Quiz.findAll({
	include:[{model:models.Comment}]
      }).then(function(preg) {
	for( i in preg) {
	  if(preg[i].Comments.length)
	   estadio.preguntasConComentario++;
	}

	estadio.preguntasSinComentario = estadio.totalPreguntas - estadio.preguntasConComentario;
	
	console.log('Total preguntas: ' + estadio.totalPreguntas);
	console.log('Total Comentarios: ' + estadio.totalComentarios);
	console.log('Nº medio de comentarios por pregunta' + estadio.mediaComentarioPregunta);
	console.log('Preguntas Comentadas: ' + estadio.preguntasConComentario);
	console.log('Preguntas No Comentadas: ' + estadio.preguntasSinComentario);
	
	res.render('quizes/estadisticas', {estadio:estadio, errors: []});
      });
    });
  });
  //return;
};
    