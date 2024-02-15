
// // const { Sequelize } = require('sequelize');

// const pool = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASS,
//   database: process.env.MYSQL_DB,
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// });


// module.exports = pool ;

// const mysql = require('mysql2/promise');
// const { Sequelize } = require('sequelize');

// const sequelize = new Sequelize(
//   process.env.MYSQL_DB, // database name
//   process.env.DB_USER, // database username
//   process.env.DB_PASS, // database password
//   {
//     host: process.env.DB_HOST,
//     dialect: 'mysql'
//   }
// );

// module.exports = sequelize;
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.MYSQL_DB, // database name
  process.env.DB_USER, // database username
  process.env.DB_PASS, // database password
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    
  }
);



module.exports = sequelize;