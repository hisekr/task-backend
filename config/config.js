// // const Sequelize = require("sequelize");

// // const database = new Sequelize({
// //   database: "varthana",
// //   username: "root",
// //   password: "123456",
// //   dialect: "mysql",
// // });
// //
// // module.exports = database;

// // const Sequelize = require("sequelize");
// // const dotenv = require("dotenv");

// // dotenv.config();

// // const database = new Sequelize({
// //   host: "localhost",
// //   database: process.env.DATABASE,
// //   // username: process.env.USERNAME,
// //   username: "root",
// //   password: process.env.PASSWORD,
// //   dialect: "mysql",
// //   port: 3306,
// // });

// // module.exports = database;

// const Sequelize = require("sequelize");
// const dotenv = require("dotenv");

// dotenv.config();

// const database = new Sequelize(
//   process.env.DATABASE,
//   process.env.USERNAME,
//   process.env.PASSWORD,
//   {
//     host: monorail.proxy.rlwy.net,
//     dialect: "mysql",
//     port: 49940,
//     pool: {
//       max: 10,
//       min: 0,
//       acquire: 30000,
//       idle: 10000,
//     },
//     // dialectOptions: {
//     //   socketPath: "/opt/lampp/var/mysql/mysql.sock",
//     // },
//     logging: true,
//   }
// );

// module.exports = database;

const Sequelize = require("sequelize");
const dotenv = require("dotenv");

dotenv.config();

const database = new Sequelize(
  process.env.MYSQLDATABASE,
  process.env.MYSQLUSER,
  process.env.MYSQLPASSWORD,
  {
    host: process.env.MYSQLHOST,
    dialect: "mysql",
    port: process.env.MYSQLPORT,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    logging: true,
  }
);

module.exports = database;
