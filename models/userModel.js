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
}

module.exports = User;