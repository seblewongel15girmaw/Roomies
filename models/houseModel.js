

const pool = require('../config/dbConfig');

class House {
  async createHouse(houseData) {
    const connection = await pool.getConnection();

    try {
      const {
        broker_id, location, price, no_of_rooms, description,
      } = houseData;

      const query = 'INSERT INTO houses (broker_id, location, price, no_of_rooms, description) VALUES (?, ?, ?, ?, ?)';
      const bindParams = [broker_id, location, price, no_of_rooms, description];

      console.log('SQL Query:', query);
      const [result] = await connection.execute(query, bindParams);

      return result.insertId;
    } catch (error) {
      console.error('Error creating house:', error);
      throw error;
    } finally {
      connection.release();
    }
  }

  static async getHouseById(houseId) {
    try {
      const query = 'SELECT houses.*, brokers.full_name as broker_name FROM houses JOIN brokers ON houses.broker_id = brokers.id WHERE houses.id = ?';
      const connection = await pool.getConnection();
      const [house] = await connection.query(query, [houseId]);
      connection.release();
      return house[0]; // Assuming there's only one house with the given ID
    } catch (error) {
      throw error;
    }
  }

  static async deleteHouse(houseId) {
    try {
      const query = 'DELETE FROM houses WHERE id = ?';
      const connection = await pool.getConnection();
      await connection.query(query, [houseId]);
      connection.release();
    } catch (error) {
      throw error;
    }
  }

  static async updateHouse(houseId, updatedHouseData) {
    const connection = await pool.getConnection();

    try {
      const {
        broker_id, location, price, no_of_rooms, description,
      } = updatedHouseData;

      const query = 'UPDATE houses SET broker_id=?, location=?, price=?, no_of_rooms=?, description=? WHERE id=?';
      const bindParams = [broker_id, location, price, no_of_rooms, description, houseId];

      console.log('SQL Query:', query);
      const [result] = await connection.execute(query, bindParams);

      return result.affectedRows;
    } catch (error) {
      console.error('Error updating house:', error);
      throw error;
    } finally {
      connection.release();
    }
  }


}

module.exports = House;




// const { DataTypes } = require("sequelize");
// const sequelize = require("../config/dbConfig");
// const { v4: uuidv4 } = require('uuid');


// const House = sequelize.define("House", {
//   houseId: {
//     type: DataTypes.UUID,
//     defaultValue: uuidv4(),
//     allowNull: false,
//     primaryKey: true,
//   },
//   location: {
//     type: DataTypes.STRING,
//     allowNull: false
//   },
//   numberOfRoom: {
//     type: DataTypes.INTEGER,
//     allowNull: false
//   },
//   price: {
//     type: DataTypes.FLOAT,
//     allowNull: false

//   },
//   description: {
//     type: DataTypes.STRING,
//   },

// })


// const Image = sequelize.define('Image', {
//   imageId: {
//     type: DataTypes.UUID,
//     defaultValue: DataTypes.UUIDV4,
//     allowNull: false,
//     primaryKey: true,
//   },
//   imageUrl: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
// });



// module.exports = { House, Image }