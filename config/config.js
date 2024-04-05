// const Sequelize = require("sequelize");

// const database = new Sequelize({
//   database: "varthana",
//   username: "root",
//   password: "123456",
//   dialect: "mysql",
// });

// module.exports = database;

const Sequelize = require("sequelize");
const dotenv = require("dotenv");

dotenv.config();

const database = new Sequelize({
  host: "localhost",
  database: process.env.DATABASE,
  // username: process.env.USERNAME,
  username: "root",
  password: process.env.PASSWORD,
  dialect: "mysql",
  port: 3306,
});

module.exports = database;

// const Sequelize = require("sequelize");
// const dotenv = require("dotenv");

// dotenv.config();

// const database = new Sequelize(
//   process.env.DATABASE,
//   process.env.USERNAME,
//   process.env.PASSWORD,
//   {
//     dialect: "mysql",
//     port: 3306,
//     host: "localhost",
//   }
// );

// module.exports = database;
