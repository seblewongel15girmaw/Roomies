const mysql = require("mysql2");
const { Sequelize } = require("sequelize");
require("dotenv").config()

const pool = mysql.createPool({
    user: DB_USER,
    password: DB_PASSWORD,
    database: DATABASE,
    host: DB_HOST,
    connectionLimit: 10,
    waitForConnections: true,
    queueLimit:0
})


const sequelize = new Sequelize('roomies', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql',
});

module.exports=sequelize