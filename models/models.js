//construye el modelo
var path = require('path');

// Cargar modelo ORM object Relation Mapping
var Sequelize = require('sequelize');

//Postgres DATABASE_URL = postgres://user:passwd@host:port/database
//SQLite DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name  = (url[6] ||null);
var user     = (url[2] ||null);
var pwd	     = (url[3] ||null);
var protocol = (url[1] ||null);
var dialect  = (url[1] ||null);
var port     = (url[5] ||null);
var host     = (url[4] ||null);
var storage  = process.env.DATABASE_STORAGE;


//Cargar Modelo  ORM object relation mapping
var sequelize = new Sequelize(DB_name, user, pwd,
			      {dialect: protocol,
				protocol: protocol,
			      port: port,
			      host: host,
			      storage: storage, // solo SQLite (.env)
			      omitNull: true //solo Postgres
			      }
		    );

// Importar la definición de la tabla Quiz en quiz.js
var quiz_path = path.join(__dirname, 'quiz');
var Quiz = sequelize.import(quiz_path);

exports.Quiz = Quiz; // exportar la definición de tabla Quiz

// sequelize.sync() crea e inicializa tabla de preguntas en DB
sequelize.sync().then(function() {
  // success(..) ahora then(...)  ejecuta el manejador una vez creada la tabla
  Quiz.count().then(function(count) {
    if(count === 0) { // la tabla se inicializa solo si está vacía
      Quiz.create({ pregunta : 'Capital de Italia',
		    respuesta: 'Roma'
      });
      Quiz.create({ pregunta : 'Capital de Portugal',
		    respuesta: 'Lisboa'
      })
      .then(function() {console.log('Base de datos inicializada')});
    };
  });
});