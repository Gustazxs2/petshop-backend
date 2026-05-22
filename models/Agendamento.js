const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Agendamento = sequelize.define("Agendamento", {
  nomePet: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  data: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  servico: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  userEmail: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Agendamento;