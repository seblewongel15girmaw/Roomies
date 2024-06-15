
const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");


const House = sequelize.define("House", {
  houseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Location is required.'
      },
      notEmpty: {
        msg: 'Location is must not be empty'
      },
    }

  },
  numberOfRoom: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Number of rooms is required.'
      },
      notEmpty: {
        msg: 'Number of rooms is must not be empty'
      },
      isInt: {
        msg: 'Number of rooms must be an integer.'
      },
      min: {
        args: [1],
        msg: 'Number of rooms must be at least 1.'
      },
      max: {
        args: [10],
        msg: 'Number of rooms cannot exceed 10.'
      }
    }
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Price is required.'
      },
      notEmpty: {
        msg: 'Price is must not be empty'
      },
      isFloat: {
        msg: 'Price must be a valid floating point number.'
      },
      min: {
        args: [0],
        msg: 'Price must be greater than or equal to 0.'
      }
    }
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  rental_status: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },

})


const Image = sequelize.define('Image', {
  imageId: {
   
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Image is required'
      },
      notEmpty: {
         msg: "Image cannot be empty." 
        },
 
      
    }
  },
});



module.exports = { House, Image }