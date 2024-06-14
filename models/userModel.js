

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
      len: {
        args: [3, 30],
        msg: 'Username must be between 3 and 30 characters long'
      },
      
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
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
      notEmpty: {
        msg: 'Password is required'
      },
      len: {
        args: [8, 30],
        msg: 'Password must be atleast 8 charcters long'
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
      optional: true,
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
    validate: {
      optional: true,
      isString: {
        msg: 'Image must be a string'
      }
    }
  },
  personal_id: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      optional: true,
      isString: {
        msg: 'Personal ID must be a string'
      }
    }
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      optional: true,
      isString: {
        msg: 'Bio must be a string'
      }
    }
  },
  phone_number: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: {
        args: 13,
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
    validate: {
      optional: true,
      isString: {
        msg: 'job_status must be a string'
      }
    }
  },
  smoking: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      optional: true,
      isString: {
        msg: 'smoking must be a string'
      }
    }
  },
  pets: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      optional: true,
      isString: {
        msg: 'pets must be a string'
      }
    }
  },
  privacy: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      optional: true,
      isString: {
        msg: 'privacy must be a string'
      }
    }
  },
  religious_compatibility: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      optional: true,
      isString: {
        msg: 'religious_compatibility must be a string'
      }
    }
  },
  socialize: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      optional: true,
      isString: {
        msg: 'socialize must be a string'
      }
    }
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