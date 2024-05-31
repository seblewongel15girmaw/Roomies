const User = require('../models/userModel');
const Broker = require('../models/brokerModel');
const Admin = require('../models/adminModel');

async function getDashboardStatus(req, res) {
  try {
    const totalActiveUsers = await User.count({
      where: {
        activate_status: 1
      }
    });
    const totalInactiveUsers = await User.count({
      where: {
        activate_status: 0
      }
    });
    const totalBrokers = await Broker.count();
    const totalUsers = await User.count();

    res.status(200).json({
      totalActiveUsers,
      totalInactiveUsers,
      totalBrokers,
      totalUsers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = { getDashboardStatus  };