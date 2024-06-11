// import chai from 'chai';
// CommonJS module system
const { expect } = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const User = require('../../models/userModel');
const { registerUser } = require('../../controllers/userController');
const bcrypt = require('bcrypt');

describe('UsersController', () => {
  describe('registerUser', () => {
    afterEach(() => {
      sinon.restore();
    });

    it('should register a new user successfully', async () => {
      const req = {
        body: {
          full_name: 'John Doe',
          username: 'johndoe',
          email: 'john@example.com',
          password: 'password123'
        }
      };

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      sinon.stub(User, 'findOne').resolves(null);
      sinon.stub(bcrypt, 'hash').resolves('hashedPassword');
      sinon.stub(User, 'create').resolves({ id: 1 });

      await registerUser(req, res);

      expect(res.status).to.have.been.calledWith(201);
      expect(res.json).to.have.been.calledWith({
        message: 'User registered successfully',
        userId: 1
      });
    });

    it('should return an error if the username or email already exists', async () => {
      const req = {
        body: {
          username: 'johndoe',
          email: 'john@example.com'
        }
      };

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      sinon.stub(User, 'findOne').resolves({ id: 1 });

      await registerUser(req, res);

      expect(res.status).to.have.been.calledWith(400);
      expect(res.json).to.have.been.calledWith({
        message: 'Username or email already exists'
      });
    });

    it('should return a 500 error if something goes wrong', async () => {
      const req = {
        body: {
          full_name: 'John Doe',
          username: 'johndoe',
          email: 'john@example.com',
          password: 'password123'
        }
      };

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      sinon.stub(User, 'findOne').rejects(new Error('Database error'));

      await registerUser(req, res);

      expect(res.status).to.have.been.calledWith(500);
      expect(res.json).to.have.been.calledWith({
        message: 'Internal server error',
        error: 'Database error'
      });
    });
  });
});