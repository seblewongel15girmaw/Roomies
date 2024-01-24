const pool = require('../config/dbConfig');

class User {
  async createUser(userData) {
    const connection = await pool.getConnection();

    try {
      const {
        full_name, username, email, password, gender, age, budget, image, personal_id, bio, phone_number, address, job_status,
      } = userData;

      const query = 'INSERT INTO users (full_name, username, email, password, gender, age, budget, image, personal_id, bio, phone_number, address, job_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

      const bindParams = [
        full_name || null,
        username || null,
        email || null,
        password || null,
        gender || null,
        age || null,
        budget || null,
        image || null,
        personal_id || null,
        bio || null,
        phone_number || null,
        address || null,
        job_status || null,
      ];

      console.log('SQL Query:', query);
      const [result] = await connection.execute(query, bindParams);

      return result.insertId;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    } finally {
      connection.release();
    }
  }


  // for login
  static getUserByUsername(username) {
    return new Promise(async (resolve, reject) => {
      try {
        const connection = await pool.getConnection(); // Get a connection from the pool
  
        const query = 'SELECT * FROM users WHERE username = ?';
        const [results] = await connection.query(query, [username]);
  
        connection.release(); // Release the connection back to the pool
  
        resolve(results[0] || null);
      } catch (error) {
        reject(error);
      }
    });
  }


  static async deleteUser(userId) {
    try {
      const query = 'DELETE FROM users WHERE id = ?';
      const connection = await pool.getConnection();
      await connection.query(query, [userId]);
      connection.release();
    } catch (error) {
      throw error;
    }
  }

}

module.exports = User;