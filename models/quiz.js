// Definición del modelo de Quiz, tabla, db

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Quiz',
			  { pregunta: DataTypes.STRING,
			    respuesta: DataTypes.STRING,
			  });
}