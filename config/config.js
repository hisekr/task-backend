// const Sequelize = require("sequelize");

// const database = new Sequelize({
//   database: "varthana",
//   username: "root",
//   password: "123456",
//   dialect: "mysql",
// });
//
// module.exports = database;

// const Sequelize = require("sequelize");
// const dotenv = require("dotenv");

// dotenv.config();

// const database = new Sequelize({
//   host: "localhost",
//   database: process.env.DATABASE,
//   // username: process.env.USERNAME,
//   username: "root",
//   password: process.env.PASSWORD,
//   dialect: "mysql",
//   port: 3306,
// });

// module.exports = database;

const Sequelize = require("sequelize");
const dotenv = require("dotenv");

dotenv.config();

const database = new Sequelize(
  process.env.DATABASE,
  "root",
  process.env.PASSWORD,
  {
    host: "localhost",
    dialect: "mysql",
    port: 3306,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    dialectOptions: {
      socketPath: "/opt/lampp/var/mysql/mysql.sock",
    },
  }
);

module.exports = database;
