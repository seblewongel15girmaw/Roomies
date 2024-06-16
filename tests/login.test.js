const { loginUser } = require('../controllers/userController');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

jest.mock('../models/userModel', () => ({
  getUserByUsername: jest.fn(),
}));

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}));

describe('loginUser', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        username: 'testuser',
        password: 'password123',
      },
    };
    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
  });

  


  it('should log in a user with valid credentials', async () => {
    // Mock behavior of User.getUserByUsername
    User.getUserByUsername.mockResolvedValue({
      id: 1,
      username: 'testuser',
      password: 'hashedPassword',
      verified: 1,
    });

    // Mock behavior of bcrypt.compare
    bcrypt.compare.mockResolvedValue(true);

    // Mock behavior of jwt.sign
    jwt.sign.mockReturnValue('token');

    await loginUser(req, res);

    expect(User.getUserByUsername).toHaveBeenCalledTimes(1);
    expect(bcrypt.compare).toHaveBeenCalledTimes(1);
    expect(jwt.sign).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'User logged in successfully', token: 'token' });
  });

  


}


);
