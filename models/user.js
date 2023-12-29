const mysql = require('mysql2/promise');

class User {
  async createUser(userData) {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'roomies',
    });

    try {
      const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
      const [result] = await connection.execute(query, [
        userData.username,
        userData.email,
        userData.password,
      ]);
      return result.insertId;
    } catch (error) {
      throw new Error('Error creating user');
    } finally {
      connection.close();
    }
  }
}

module.exports = User;