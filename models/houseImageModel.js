const mysql = require('mysql2/promise');
const dbConfig = require('../config/dbConfig');

class HouseImage {
  static async create(houseId, imageFilename) {
    try {
      const connection = await mysql.createConnection(dbConfig);
      await connection.query('INSERT INTO house_images (house_id, image_filename) VALUES (?, ?)', [houseId, imageFilename]);
      connection.end();
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  static async getAllByHouseId(houseId) {
    try {
      const connection = await mysql.createConnection(dbConfig);
      const [rows] = await connection.query('SELECT * FROM house_images WHERE house_id = ?', [houseId]);
      connection.end();
      return rows;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  static async deleteById(imageId) {
    try {
      const connection = await mysql.createConnection(dbConfig);
      await connection.query('DELETE FROM house_images WHERE id = ?', [imageId]);
      connection.end();
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  static async updateById(imageId, imageFilename) {
    try {
      const connection = await mysql.createConnection(dbConfig);
      await connection.query('UPDATE house_images SET image_filename = ? WHERE id = ?', [imageFilename, imageId]);
      connection.end();
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}

module.exports = HouseImage;