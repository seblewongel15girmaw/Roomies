const pool = require('../config/dbConfig');

class Chat {
    static async createChat(senderId, receiverId, message, image) {
        try {
          const connection = await pool.getConnection();
    
          const query =
            'INSERT INTO messages (sender_id, receiver_id, message, image) VALUES (?, ?, ?, ?)';
          const bindParams = [senderId, receiverId, message, image];
    
          // Check and replace undefined with null
          for (let i = 0; i < bindParams.length; i++) {
            if (typeof bindParams[i] === 'undefined') {
              bindParams[i] = null;
            }
          }
    
          const [result] = await connection.execute(query, bindParams);
          connection.release();
    
          return result.insertId;
        } catch (error) {
          throw error;
        }
      }

  static async getChats(senderId, receiverId) {
    try {
      const connection = await pool.getConnection();
      console.log('senderId:', senderId);
      console.log('receiverId:', receiverId);


      const query =
        'SELECT * FROM messages WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?) ORDER BY timestamp ASC';
      const bindParams = [senderId, receiverId, receiverId, senderId];

      const [rows] = await connection.execute(query, bindParams);
      connection.release();

      return rows;
    } catch (error) {
      throw error;
    }
  }

  // ...
}

module.exports = Chat;