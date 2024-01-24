const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");
const { v4: uuidv4 } = require('uuid');


const BrokerProfile = sequelize.define('BrokerProfile', {
    brokerProfileId: {
        type: DataTypes.UUID,
        defaultValue: uuidv4(),
        allowNull: false,
        primaryKey: true,
    },
    phoneNumber1: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    phoneNumber2: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        unique: true
    },
    brokerProfilePic: {
        type: DataTypes.STRING,
        allowNull: false
    }

})


module.exports = BrokerProfile
