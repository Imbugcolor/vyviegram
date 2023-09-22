require('dotenv').config()
const { Types } = require('mongoose');
const authCtrl = require('../../controllers/authCtrl');
const Users = require('../../models/userModel');
const bcrypt = require('bcrypt');
const { createActiveToken } = require('../../helpers/generateToken')
const sendMail = require('../../config/sendMail')

const { register } = authCtrl

// Mock dependencies
jest.mock('../../config/sendMail'); // Mock the sendMail function
jest.mock('../../helpers/generateToken', () => ({
    createActiveToken: jest.fn(() => 'activetoken')
})); // Mock the createActiveToken func

describe('register function', () => {
    it('should register a new user successfully', async () => {
    // Mock the request and response objects
    const req = {
        body: {
        fullname: 'John Doe',
        username: 'johndoe',
        email: 'johndoe@example.com',
        password: 'password123',
        gender: 'male',
        },
    };
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };

    // Mock the findOne function of Users model
    Users.findOne = jest.fn()
      .mockReturnValueOnce(null) // Mock for username not found
      .mockReturnValueOnce(null); // Mock for email not found

    // Mock the bcrypt.hash function
    bcrypt.hash = jest.fn().mockResolvedValue('hashedPassword');

    // Call the register function
    await register(req, res);

    // Assertions
    expect(Users.findOne).toHaveBeenCalledTimes(2); // Check if findOne was called twice
    expect(bcrypt.hash).toHaveBeenCalledWith('password123', 12); // Check if bcrypt.hash was called with the correct arguments
    // Check createActiveToken function was called with user object request expected.
    expect(createActiveToken).toHaveBeenCalledWith({ newUser: { fullname: 'John Doe', username: 'johndoe', email: 'johndoe@example.com', password: 'hashedPassword', gender: 'male' }});
    // Check sendMail function was called with expected parameters.
    expect(sendMail).toHaveBeenCalledWith('johndoe@example.com', `${process.env.CLIENT_URL}/active/activetoken`, 'Active your Vyviegram account.');
    expect(res.status).toHaveBeenCalledWith(200); // Check if the response status was set to 200
  });

  it('should send a status code of 400 when user is exists.', async() => {
    // Mock the request and response objects
    const req = {
        body: {
        fullname: 'John Doe',
        username: 'johndoe',
        email: 'johndoe@example.com',
        password: 'password123',
        gender: 'male',
        },
    };
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };
    Users.findOne.mockImplementationOnce(() => ({
        _id: new Types.ObjectId(),
        fullname: 'fullname', 
        username: 'username', 
        email: 'email', 
        password: 'password', 
        gender: 'male'
    }))
    await register(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledTimes(1);
  })

  it('should send a status code of 400 due to password length less than 6 characters', async () => {
    // Implement a test case for when the password is too short
    // Mock the request and response objects
    const req = {
        body: {
        fullname: 'John Doe',
        username: 'johndoe',
        email: 'johndoe@example.com',
        password: 'pass1',
        gender: 'male',
        },
    };
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };
    // Mock the request with a short password
    await register(req, res);
    // Check that the response status and JSON message are as expected
    expect(res.status).toHaveBeenCalledWith(400);
    // Check that the response status and JSON are called one time
    expect(res.json).toHaveBeenCalledTimes(1);
  });
});