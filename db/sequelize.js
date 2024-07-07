const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(`${process.env.PSQL_URL}`)

module.exports = { sequelize, DataTypes };

// var client = new pg.Client('');