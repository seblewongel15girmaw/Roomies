

const pool = require('../config/dbConfig');

class Broker {
  async createBroker(brokerData) {
    const connection = await pool.getConnection();


    try {
      const {
        full_name, username, email, password, gender, address, phone_number1, profile_pic, phone_number2,
      } = brokerData;

      const query = 'INSERT INTO brokers (full_name, username, email, gender, address, phone_number1, profile_pic, phone_number2, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
      const bindParams = [
        full_name, username, email, password, gender, address, phone_number1, profile_pic, phone_number2,
      ];

      console.log('SQL Query:', query);
      const [result] = await connection.execute(query, bindParams);

      return result.insertId;
    } catch (error) {
      console.error('Error creating brokers:', error);
      throw error;
    } finally {
      connection.release();
    }
  }


  static async deleteBroker(brokerId) {
    try {
      const query = 'DELETE FROM brokers WHERE id = ?';
      const connection = await pool.getConnection();
      await connection.query(query, [brokerId]);
      connection.release();
    } catch (error) {
      throw error;
    }
  }
}











// const { DataTypes } = require('sequelize');
// const { v4: uuidv4 } = require('uuid');
// const sequelize = require("../config/dbConfig");


// const Broker = sequelize.define('Broker', {
//     brokerId: {
//         type: DataTypes.UUID,
//         defaultValue: uuidv4(),
//         allowNull: false,
//         primaryKey: true,
//     },
//     fullName: {
//         type: DataTypes.STRING,
//         allowNull: false,
//     },
//     userName: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     phoneNumber: {
//         type: DataTypes.BIGINT,
//         allowNull: false
//     },
//     password: {
//         type: DataTypes.STRING,
//         allowNull: false,
//     },
// });



// module.exports = Broker;
