// userController.test.js

const { registerUser } = require('../controllers/userController'); // Adjust path as per your folder structure
const User = require('../models/userModel'); // Adjust path as per your folder structure
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer'); // Import nodemailer

jest.mock('../models/userModel', () => ({
  findOne: jest.fn(),
  create: jest.fn(),
}));

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
}));

jest.mock('crypto', () => ({
  randomBytes: jest.fn(),
}));

// Mock nodemailer completely
jest.mock('nodemailer', () => ({
  createTransport: jest.fn(() => ({
    sendMail: jest.fn(),
  })),
}));

// Example test case
describe('registerUser', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        full_name: 'Test User',
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      },
    };
    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
  });

  it('should register a new user', async () => {
    // Mocking behavior of User.findOne
    User.findOne.mockResolvedValue(null);

    // Mocking behavior of bcrypt.hash
    bcrypt.hash.mockResolvedValue('hashedPassword');

    // Mocking behavior of crypto.randomBytes
    crypto.randomBytes.mockReturnValue({
      toString: jest.fn(() => 'randomToken'),
    });

    // Mocking behavior of User.create
    User.create.mockResolvedValue({
      email: req.body.email,
      save: jest.fn(),
    });

    // Call the registerUser function
    await registerUser(req, res);

    // Assertions
    expect(User.findOne).toHaveBeenCalledTimes(1);
    expect(bcrypt.hash).toHaveBeenCalledTimes(1);
    expect(crypto.randomBytes).toHaveBeenCalledTimes(1);
    expect(User.create).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'User registered successfully, and verify your email' });
  });

  

});

// login test

