const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");
  
const profileModel = sequelize.define('BrokerProfile', {
    phone1: {
        
    },
    phone2:{

    },
    profilePic: {
        
    },

    
})


module.exports=profileModel