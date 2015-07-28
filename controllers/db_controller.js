// controlador, 
var models = require('../models/models.js');
   
// get /quizes/mostrardb
exports.mostrardb = function(req, res) {
  models.Quiz.findAll().then(function(quizdb){
    models.Comment.findAll().then(function(commetdb) {
      models.User.findAll().then(function(userdb){
	res.render('quizes/mostrardb', {quizes: quizdb,
				      comments: commetdb,
				      users: userdb,
				      errors: []
	});
      });
    });
  });
};
  