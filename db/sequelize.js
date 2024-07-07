const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(`${process.env.PSQL_URL}`, {
  dialectModule: require("pg")
})

module.exports = { sequelize, DataTypes };