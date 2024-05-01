

const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const Similarity = sequelize.define('Similarity', {
 

    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        primaryKey:true
      },
      similarityScores: {
        type: DataTypes.JSON,
        defaultValue: {}
      }
 
  
  
});




module.exports = Similarity;