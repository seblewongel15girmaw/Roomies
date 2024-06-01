const User = require('../models/userModel');


async function deleteInactiveAccounts() {
  try {
    const inactiveThreshold = 90; // Delete accounts inactive for more than 90 days
    const now = new Date();
    const inactiveDate = new Date(now.getTime() - (inactiveThreshold * 24 * 60 * 60 * 1000));

    const inactiveUsers = await User.find({
      lastLoginDate: { $lte: inactiveDate }
    });

    for (const user of inactiveUsers) {
      await user.destroy();
    }

    console.log(`Deleted ${inactiveUsers.length} inactive user accounts.`);
  } catch (error) {
    console.error('Error deleting inactive accounts:', error);
    throw error;
  }
}

module.exports = {
  deleteInactiveAccounts
};
