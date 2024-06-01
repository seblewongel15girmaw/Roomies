const { DataTypes } = require('sequelize');
const sequelize = require("../config/dbConfig");

const Broker = sequelize.define('Broker', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  full_name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Full name is required'
      },
      notEmpty: {
        msg: 'Full name must not be empty'
      }
    }
  },
 
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notNull: {
        msg: 'Email is required'
      },
      notEmpty: {
        msg: 'Email must not be empty'
      },
      isEmail: {
        msg: 'Email must be a valid email address'
      }
    }
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Gender is required'
      },
      notEmpty: {
        msg: 'Gender must not be empty'
      }
    }
  },
  phone_number1: {
    type: DataTypes.BIGINT,
    allowNull: false,
    unique: true,
    validate: {
      notNull: {
        msg: 'Phone number 1 is required'
      },
      notEmpty: {
        msg: 'Phone number 1 must not be empty'
      }
    }
  },
  phone_number2: {
    type: DataTypes.BIGINT,
    allowNull: true,
    unique: true,
    validate: {
      isNumeric: {
        msg: 'Phone number 2 must be a numeric value'
      }
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Password is required'
      },
      notEmpty: {
        msg: 'Password must not be empty'
      },
      len: {
        args: [8, 100],
        msg: 'Password must be between 8 and 100 characters long'
      }
    }
  },
  profile_pic: {
    type: DataTypes.STRING,
    allowNull: true
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Address is required'
      },
      notEmpty: {
        msg: 'Address must not be empty'
      }
    }
  }
  ,
  verify: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
});
Broker.getBrokerByEmail = async function (email) {
  return Broker.findOne({
    where: {
      email: email
    }
  });
};

module.exports = Broker;