const User = require('../models/userModel');
const Broker = require('../models/brokerModel');
const Admin = require('../models/adminModel');

async function getDashboardStatus(req, res) {
  try {
    const totalUsers = await User.count();
    const totalBrokers = await Broker.count();
    const totalAdmins = await Admin.count();

    res.status(200).json({
      totalUsers,
      totalBrokers,
      totalAdmins,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = { getDashboardStatus  };