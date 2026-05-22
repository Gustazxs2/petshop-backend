const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Produto = sequelize.define("Produto", {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  categoria: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  preco: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },

  descricao: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  imagem: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

module.exports = Produto;