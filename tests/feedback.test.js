const { createFeedback, getAllFeedbacks } = require('../controllers/feedbackController');
const Feedback = require('../models/feedbackModel');
const User = require('../models/userModel');

jest.mock('../models/feedbackModel');
jest.mock('../models/userModel');

describe('Feedback Controller', () => {
  describe('createFeedback', () => {
    let req, res, next;

    beforeEach(() => {
      req = {
        params: { user_id: '1' },
        body: {
          rating: 4,
          feedback_message: 'Great product!',
          feedback_category: ['general']
        }
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      next = jest.fn();
    });

    it('should create a new feedback', async () => {
      const feedback = { id: 1, user_id: '1', rating: 4, feedback_message: 'Great product!', feedback_category: 'general' };
      Feedback.create.mockResolvedValue(feedback);

      await createFeedback(req, res, next);

      expect(Feedback.create).toHaveBeenCalledWith({
        user_id: '1',
        rating: 4,
        feedback_message: 'Great product!',
        feedback_category: 'general'
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Feedback created successfully', data: feedback });
    });

    it('should handle validation errors', async () => {
      const error = { name: 'SequelizeValidationError', errors: [{ message: 'Rating must be between 1 and 5' }] };
      Feedback.create.mockRejectedValue(error);

      await createFeedback(req, res, next);

      expect(Feedback.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ errors: ['Rating must be between 1 and 5'] });
    });

    it('should handle other errors', async () => {
      const error = new Error('Internal server error');
      Feedback.create.mockRejectedValue(error);

      await createFeedback(req, res, next);

      expect(Feedback.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ success: false, error: error.message });
    });
  });

  describe('getAllFeedbacks', () => {
    let req, res, next;

    beforeEach(() => {
      req = {};
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      next = jest.fn();
    });

    it('should retrieve all feedbacks with usernames', async () => {
      const feedbacks = [
        { id: 1, user_id: '1', rating: 4, feedback_message: 'Great product!', feedback_category: 'general', User: { username: 'John Doe' } },
        { id: 2, user_id: '2', rating: 3, feedback_message: 'Could be better', feedback_category: 'improvement', User: { username: 'Jane Smith' } }
      ];
      Feedback.findAll.mockResolvedValue(feedbacks);

      await getAllFeedbacks(req, res, next);

      expect(Feedback.findAll).toHaveBeenCalledWith({ include: User });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([
        { id: 1, username: 'John Doe', rating: 4, feedback_message: 'Great product!', feedback_category: 'general', createdAt: undefined, updatedAt: undefined },
        { id: 2, username: 'Jane Smith', rating: 3, feedback_message: 'Could be better', feedback_category: 'improvement', createdAt: undefined, updatedAt: undefined }
      ]);
    });

    it('should handle errors', async () => {
      const error = new Error('Internal server error');
      Feedback.findAll.mockRejectedValue(error);

      await getAllFeedbacks(req, res, next);

      expect(Feedback.findAll).toHaveBeenCalledWith({ include: User });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ success: false, error: error.message });
    });
  });
});