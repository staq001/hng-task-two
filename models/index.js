const { sequelize, DataTypes } = require('../db/sequelize.js');
const bcrypt = require('bcryptjs')


const User = sequelize.define("User", {
  userId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    trim: true
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
    trim: true
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
    trim: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    trim: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [8, 50],
        msg: "password must be between 8 to 50 digits"
      }
    }
  },
  phone: {
    type: DataTypes.STRING,
    validate: {
      len: {
        args: [11],
        msg: "Phone number must be exactly 11 digits"
      }
    }
  }
});

const Organisation = sequelize.define("Organisation", {
  orgId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    trim: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
  },
  ownerId: {
    type: DataTypes.UUID,
    allowNull: false
  }
});


// many to many relationship,
Organisation.belongsToMany(User, { through: "add", foreignKey: "org_id" });
User.belongsToMany(Organisation, { through: "add", foreignKey: "user_id" });



User.beforeCreate(async (user, options) => {
  const hashedPassword = await bcrypt.hash(user.password, 8)
  user.password = hashedPassword;

})


User.afterCreate(async (user, options) => {
  sequelize.sync();
  const organisation = await Organisation.create({
    name: `${user.firstName}'s Organisation`,
    ownerId: user.userId
  })
})


// (async function () {
//   try {
//     // synchroninize all models;
//     await sequelize.sync({});

//     const user = await User.create({
//       firstName: "Raz",
//       lastName: "Staq",
//       email: "trentokay6550@gmail.com",
//       password: "134wertyuo",
//       phone: "08045466666"
//     });
// })()




module.exports = { User, Organisation };
