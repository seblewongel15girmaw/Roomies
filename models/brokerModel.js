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

module.exports = Broker;