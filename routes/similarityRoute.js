
const express = require('express');
const router = express.Router();
const SimilarityController = require('../controllers/similarityController');
const authenticate = require('../middlewares/auth');

// Get preference list
// router.get('/preferenceList/:id', SimilarityController.getPreferenceList);
router.get('/preferenceList/:id', authenticate,(req, res, next) => {
    // console.log('Role in route handler:', req.role);
    if (req.role === 'user') {
        SimilarityController.getPreferenceList(req, res, next);
    } else {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }
  });

// save similarity
router.post('/save', SimilarityController.saveSimilarity);

module.exports = router;