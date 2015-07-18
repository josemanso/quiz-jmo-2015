// Definición del modelo de Commet, tabla, db

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    'Comment',
    { texto: {
      type: DataTypes.STRING,
      validate: { notEmpty: {msg: "-> Falta Comentario"}}
    }
    }
		   );
}