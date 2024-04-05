const Sequelize = require("sequelize");
const db = require("../config/config");

const dotenv = require("dotenv");

dotenv.config();

db.sync()
  .then(() => {
    console.log("Database Connected");
  })
  .catch((error) => {
    console.error("Error Connecting:", error);
  });

const User = db.define("user", {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },

  email: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },

  phone: {
    type: Sequelize.STRING,
    allowNull: false,
  },

  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },

  dob: {
    type: Sequelize.DATEONLY,
    allowNull: false,
  },
  address: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = User;
