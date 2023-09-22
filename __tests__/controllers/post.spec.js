const Posts = require('../../models/postModel')
const postCtrl = require('../../controllers/postCtrl')

const { createPost } = postCtrl; 

describe('createPost function', () => {
  it('should create a new post successfully', async () => {
    // Mock the request and response objects
    const req = {
      body: {
        content: 'This is a test post.',
        images: ['image1.jpg', 'image2.jpg'],
      },
      user: {
        _id: 'user123', // Mock the user ID
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock the Posts model and its save function
    
    // Create a spy on the `create` method of the Posts model
    const createSpy = jest.spyOn(Posts, 'create');
    // Mock the behavior of the `create` method
    createSpy.mockResolvedValue({
        _id: 1,
        content: 'This is a test post.',
        images: ['image1.jpg', 'image2.jpg'],
        user: 'user123', // Mocked user ID
    });

    // Call the createPost function
    await createPost(req, res);

    // Assertions
    // Check Post create expected
    expect(Posts.create).toHaveBeenCalledWith({
        content: 'This is a test post.',
        images: ['image1.jpg', 'image2.jpg'],
        user: 'user123'
    });
    // Check that the response status and JSON message are as expected
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('should handle create post failure when no images are provided', async () => {
    // Mock the request and response objects
    const req = {
        body: {
          content: 'This is a test post.',
          images: [],
        },
        user: {
          _id: 'user123', // Mock the user ID
        },
    };
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };

    // Implement a test case for when no images are provided
    await createPost(req, res)
    // Check that the response status and JSON message are as expected
    expect(res.status).toHaveBeenCalledWith(400);
    // Check that the response status and JSON are called one time
    expect(res.json).toHaveBeenCalledTimes(1);
  });

});