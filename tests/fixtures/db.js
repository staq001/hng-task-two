const jwt = require('jsonwebtoken');
const { User, Organisation } = require('../../models/index');
const { sequelize, DataTypes } = require('../../db/sequelize');


const userOne = {
  firstName: "Tolz",
  lastName: "JaRule",
  email: "dateme@gmail.com",
  password: "dontouchme5tt"
}

const setupDatabase = async function () {
  await sequelize.sync({ force: true }) // resets or deletes the whole database before insertion.

  // deleting everything in the database prior


  // creating a user prior, most especially for LOGIN.
  await User.create(userOne)
}

module.exports = setupDatabase;