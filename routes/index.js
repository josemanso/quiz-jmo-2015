var express = require('express');
//var multer = require('multer');
var multer = require('multer');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
var sessionController = require('../controllers/session_controller');
var dbController = require('../controllers/db_controller');
var estadisticasController = require('../controllers/estadisticas_controller');
var userController = require('../controllers/user_controller');


/* GET home page. Página de entrada */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz', errors: [] });
});

//Autoload de comandos con quizId los ids
router.param('quizId', quizController.load); //autoload : quizId
router.param('commentId', commentController.load); //autoload : commentId
router.param('userId', userController.load); //autoload : userId

// Definición de rutas de sesion

router.get('/login',  sessionController.new);     // formulario login
router.post('/login', sessionController.create);  // crear sesión
router.get('/logout', sessionController.destroy); // destruir sesión

// Definicón de rutas de cuentas de usuario
router.get('/user',  userController.new);     // formulario sig in (crear cuenta)
router.post('/user', userController.create);  // registrar usuario
router.get('/user/:userId(\\d+)/edit', sessionController.loginRequired, userController.ownershipRequired, userController.edit);
router.put('/user/:userId(\\d+)', sessionController.loginRequired, userController.ownershipRequired, userController.update);
//router.delete('/user/:userId(\\d+)', sessionController.loginRequired, userController.destroy);
router.delete('/user/:userId(\\d+)', sessionController.loginRequired, userController.ownershipRequired, userController.delete);
router.get('/user/:userId(\\d+)/quizes', quizController.index);//ver mis preguntas

// Definición de rutas de quizes
router.get('/quizes', quizController.index);
router.get('/quizes/:quizId(\\d+)', quizController.show);
router.get('/quizes/:quizId(\\d+)/answer',	quizController.answer);
router.get('/quizes/new',		sessionController.loginRequired, quizController.new);
router.post('/quizes/create', 		sessionController.loginRequired, quizController.create);
//router.post('/quizes/create', sessionController.loginRequired, multer({ dest: './public/media/'}), quizController.create);
router.get('/quizes/:quizId(\\d+)/edit',sessionController.loginRequired, quizController.ownershipRequired, quizController.edit);
//router.put('/quizes/:quizId(\\d+)', 	sessionController.loginRequired, quizController.ownershipRequired, 
//					multer({dest: './public/media/'}), quizController.update);
router.put('/quizes/:quizId(\\d+)', 	sessionController.loginRequired, quizController.ownershipRequired, 
					quizController.update);
//router.delete('/quizes/:quizId(\\d+)', quizController.destroy);
router.delete('/quizes/:quizId(\\d+)', 	sessionController.loginRequired, quizController.ownershipRequired, quizController.delete);


//rutas comentarios
router.get('/quizes/:quizId(\\d+)/comments/new', commentController.new);
router.post('/quizes/:quizId(\\d+)/comments', commentController.create);
router.get('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish', 
	   sessionController.loginRequired, commentController.ownershipRequired, commentController.publish);

//rutas DB, en 
//router.get('/DB', dbController.mostrardb);
router.get('/quizes/mostrardb', dbController.mostrardb);

//ruta GET estadisticas
router.get('/quizes/estadisticas', estadisticasController.estadisticas);

router.get('/quizes/creditos/author',  quizController.author);

module.exports = router;
