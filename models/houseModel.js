const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");


const House = sequelize.define("house", {
    location: {
        type: DataTypes.STRING,
        allowNull:false
    },
    numberOfRoom: {
        type: DataTypes.INTEGER,
        allowNull:false
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull:false
        
    },
    description: {
        type: DataTypes.STRING,
    },

    images: {
  
    }

})