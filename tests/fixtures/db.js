const { User } = require('../../models/index');



const userOne = {
  firstName: "Tolz",
  lastName: "JaRule",
  email: "dateme@gmail.com",
  password: "dontouchme5tt"
}

const setupDatabase = async function () {
  await User.destroy({ where: {} })
  // resets or deletes the whole database before new insertion.

  // creating a user prior, most especially for LOGIN.
  await User.create(userOne)
}

module.exports = setupDatabase;