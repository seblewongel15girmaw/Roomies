



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