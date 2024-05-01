
const express = require('express');
const router = express.Router();
const SimilarityController = require('../controllers/similarityController');
// const { validateUserRegistration } = require('../middlewares/userValidation');
const authenticate = require('../middlewares/auth');






// get list of similarity
// router.get('/list',SimilarityController.match);
// Get preference list
router.get('/preferenceList/:id', SimilarityController.getPreferenceList);

// save similarity
router.post('/save', SimilarityController.saveSimilarity);




module.exports = router;