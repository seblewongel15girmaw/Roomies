

const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const User = sequelize.define('User', {
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

  username: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'username must not be empty'
      },
      notNull: {
        msg: 'username is required'
      },
      len: {
        args: [3, 30],
        msg: 'Username must be between 3 and 30 characters long'
      },
      
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
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Password is required'
      },
      notEmpty: {
        msg: 'Password is must not be empty'
      },
      
      
    }
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: true,
    

  },
  religion: {
    type: DataTypes.STRING,
    allowNull: true
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      isInt: {
        msg: 'Age must be an integer'
      },
      min: {
        args: [16],
        msg: 'Age must be at least 18'
      },
      max: {
        args: [120],
        msg: 'Age must be 120 or less'
      }
    }
  },
  budget: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
  
      isInt: {
        msg: 'Budget must be an integer'
      },
      min: {
        args: [0],
        msg: 'Budget must be greater than or equal to 0'
      }
    }
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
   
  },
  personal_id: {
    type: DataTypes.STRING,
    allowNull: true,
   
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true,
   
  },
  phone_number: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
    validate: {
      len: {
        args: 10,
        msg: 'Phone number must be 13 characters long'
      },
      
    }
  },
  address: {
    type: DataTypes.JSON,
    allowNull: true
  },
  job_status: {
    type: DataTypes.STRING,
    allowNull: true,
   
  },
  smoking: {
    type: DataTypes.STRING,
    allowNull: true,
   
  },
  pets: {
    type: DataTypes.STRING,
    allowNull: true,
   
  },
  privacy: {
    type: DataTypes.STRING,
    allowNull: true,
   
  },
  religious_compatibility: {
    type: DataTypes.STRING,
    allowNull: true,
   
  },
  socialize: {
    type: DataTypes.STRING,
    allowNull: true,
    
  },
  verified: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  fcm_token: {
    type: DataTypes.STRING,
    allowNull: true
  },
  verificationToken: {
    type: DataTypes.STRING,
    allowNull: false
  },
  profile_status: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue:0
  },
  payment_status: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  activate_status: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue:0
  },
});


User.getUserByUsername = async function (username) {
  return User.findOne({
    where: {
      username: username
    }
  });
};

User.getUserByEmail = async function (email) {
  return User.findOne({
    where: {
      email: email
    }
  });
};

module.exports = User;