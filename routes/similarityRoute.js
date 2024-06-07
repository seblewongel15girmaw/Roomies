
const express = require('express');
const router = express.Router();
const SimilarityController = require('../controllers/similarityController');
const authenticate = require('../middlewares/auth');

// Get preference list
router.get('/preferenceList/:id', SimilarityController.getPreferenceList);

// save similarity
router.post('/save', SimilarityController.saveSimilarity);

module.exports = router;