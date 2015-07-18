// Controlador
var models = require('../models/models.js');


// Get /quizes/:id / comment / new
exports.new = function(req, res) {
  res.render('comments/new', { quizid: req.params.quizId, errors: []});
};


//POST /quizes/:quizId/comments

exports.create = function(req, res) {
  var comment = models.Comment.build(
    { texto:req.body.comment.texto,
      QuizId: req.params.quizId
    });
  
  comment.validate().then(
    function(err) {
      if (err) {
	res.render('comments/new',
		   {comment: comment, quizid: req.params.quizId, errors: err.errors});
  
		   //{comment: comment, errors: err.errors});
      } else {
	comment  // save : guarda en DB campo texto de comment
	.save()
	.then( function(){ res.redirect('/quizes/'+req.params.quizId)})
      }  // res. redirect: Redirrección HTTP a Lista de preguntas
    }
   ).catch(function(error) {next(error)});
};
			   