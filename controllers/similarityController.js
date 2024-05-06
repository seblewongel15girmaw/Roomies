const Similarity = require('../models/similarityModel');
const UserProfile = require('../models/userModel');


// save the similarity score with users
exports.saveSimilarity = async (req, res) => {
  const similarityScores = req.body;

  try {
    for (const score of similarityScores) {
      const { userId, similarityScores } = score;

      // Check if the user already exists in the similarity table
      let existingUser = await Similarity.findOne({ where: { userId } });

      if (existingUser) {
        // User already exists, update the similarity scores
        existingUser.similarityScores = similarityScores;
        await existingUser.save();
      } else {
        // User does not exist, create a new record
        await Similarity.create({ userId, similarityScores });
      }
    }

    res.status(200).json({ message: 'Similarity scores saved and updated successfully.' });
  } catch (error) {
    console.error('Error saving similarity scores:', error);
    res.status(500).json({ message: 'An error occurred while saving similarity scores.', error: error.message });
  }
};



// get matched user profiles 
exports.getPreferenceList = async (req, res) => {
  const userId = req.params.id; // Assuming the main user ID is passed as a route parameter

  try {
    // Find the similarity scores for the main user ID
    const similarity = await Similarity.findOne({ where: { userId } });

    if (similarity) {
      const similarityScores = JSON.parse(similarity.dataValues.similarityScores);

      // Extract the user IDs from the similarity scores object
      const userProfileIds = Object.keys(similarityScores);

      const profiles = await UserProfile.findAll({ 
        where: { id: userProfileIds.map(Number) },
        attributes: {
          exclude: ['password', 'email']
        }
      });
  
      // Construct the response object with similarity scores, user profiles, and additional user information
      const preferenceList = userProfileIds.map(id => {
        const profile = profiles.find(profile => profile.id === Number(id));

       
        return {
          userId: id,
          similarityScore: similarityScores[id],
          profile: profile ? profile.toJSON() : null,
        };
      });

      res.status(200).json({ preferenceList });
    } else {
      res.status(404).json({ message: 'Similarity scores not found for the specified user ID.' });
    }
  } catch (error) {
    console.error('Error retrieving preference list:', error);
    res.status(500).json({ message: 'An error occurred while retrieving the preference list.', error: error.message });
  }
};