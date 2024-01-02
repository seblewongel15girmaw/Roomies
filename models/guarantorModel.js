
const pool = require('../config/dbConfig');

class Guarantor {
    async createGuarantor(guarantorData) {
      const connection = await pool.getConnection();
  
      try {
        const {
            full_name, user_id, personal_id_image, address, phone_number, gender
        } = guarantorData;
  
        const query = 'INSERT INTO guarantors (full_name, user_id, personal_id_image, address, phone_number, gender) VALUES (?, ?, ?, ?, ?, ?)';
        const bindParams = [
            full_name, user_id, personal_id_image, address, phone_number, gender
        ];
  
        console.log('SQL Query:', query);
        const [result] = await connection.execute(query, bindParams);
  
        return result.insertId;
      } catch (error) {
        console.error('Error creating guarantor:', error);
        throw error;
      } finally {
        connection.release();
      }
    }

    static async deleteGuarantor(guarantorId) {
      try {
        const query = 'DELETE FROM guarantors WHERE id = ?';
        const connection = await pool.getConnection();
        await connection.query(query, [guarantorId]);
        connection.release();
      } catch (error) {
        throw error;
      }
    }
}


module.exports = Guarantor;
