const { loginUser } = require('../controllers/userController'); // Adjust path as per your folder structure
const User = require('../models/userModel'); // Adjust path as per your folder structure
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
    // Mocking behavior of User.getUserByUsername
    User.getUserByUsername.mockResolvedValue({
      id: 1,
      username: 'testuser',
      password: 'hashedPassword',
      verified: 1,
    });

    // Mocking behavior of bcrypt.compare
    bcrypt.compare.mockResolvedValue(true);

    // Mocking behavior of jwt.sign
    jwt.sign.mockReturnValue('token');

    await loginUser(req, res);

    expect(User.getUserByUsername).toHaveBeenCalledTimes(1);
    expect(bcrypt.compare).toHaveBeenCalledTimes(1);
    expect(jwt.sign).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'User logged in successfully', token: 'token' });
  });

  it('should return an error for an unverified user', async () => {
    // Mocking behavior of User.getUserByUsername (user is not verified)
    User.getUserByUsername.mockResolvedValue({
      id: 1,
      username: 'testuser',
      password: 'hashedPassword',
      verified: 0,
    });

    await loginUser(req, res);

    expect(User.getUserByUsername).toHaveBeenCalledTimes(1);
    expect(bcrypt.compare).not.toHaveBeenCalled();
    expect(jwt.sign).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'User is not verified' });
  });

  it('should return an error for invalid username or password', async () => {
    // Mocking behavior of User.getUserByUsername (user does not exist)
    User.getUserByUsername.mockResolvedValue(null);

    await loginUser(req, res);

    expect(User.getUserByUsername).toHaveBeenCalledTimes(1);
    expect(bcrypt.compare).not.toHaveBeenCalled();
    expect(jwt.sign).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid username or password' });
  });

  it('should handle bcrypt comparison error', async () => {
    // Mocking behavior of User.getUserByUsername
    User.getUserByUsername.mockResolvedValue({
      id: 1,
      username: 'testuser',
      password: 'hashedPassword',
      verified: 1,
    });

    // Mocking bcrypt.compare to throw an error
    bcrypt.compare.mockRejectedValue(new Error('bcrypt comparison error'));

    try {
      await loginUser(req, res);
    } catch (error) {
      expect(User.getUserByUsername).toHaveBeenCalledTimes(1);
      expect(bcrypt.compare).toHaveBeenCalledTimes(1);
      expect(jwt.sign).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error', error: 'bcrypt comparison error' });
    }
  });
});