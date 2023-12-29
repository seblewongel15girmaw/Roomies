const pool = require('../config/dbConfig');

class User {
  async createUser(userData) {
    const connection = await pool.getConnection();

    try {
      const query = 'INSERT INTO users (full_name, username, email, password, gender, age, budget, image, personal_id, bio, phone_number, address, job_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
      console.log('SQL Query:', query);
      const [result] = await connection.execute(query, [
        userData.full_name,
        userData.username,
        userData.email,
        userData.password,
        userData.gender,
        userData.age,
        userData.budget,
        userData.image,
        userData.personal_id,
        userData.bio,
        userData.phone_number,
        userData.address,
        userData.job_status,
      ]);

      return result.insertId;
    } catch (error) {
      throw new Error('Error creating user');
    } finally {
      connection.release();
    }
  }
}

module.exports = User;