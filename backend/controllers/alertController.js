const Alert = require('../models/Alert');

// Get all alerts for user
const getAlerts = async (req, res) => {
  try {
    const userId = req.userId;

    // Find all alerts for user, sort by createdAt desc, populate trackId
    const alerts = await Alert.find({ userId })
      .sort({ createdAt: -1 })
      .populate('trackId', 'origin destination airline flightNumber currentPrice departureDate');

    res.json({
      success: true,
      count: alerts.length,
      data: alerts
    });
  } catch (error) {
    console.error('Get alerts error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving alerts'
    });
  }
};

// Mark alert as read
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const alert = await Alert.findOne({ _id: id, userId });
    
    if (!alert) {
      return res.status(404).json({ success: false, message: 'Alert not found' });
    }

    alert.isRead = true;
    await alert.save();

    res.json({ success: true, message: 'Alert marked as read' });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ success: false, message: 'Failed to mark alert as read' });
  }
};

// Delete alert
const deleteAlert = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    // Find and delete alert (verify userId)
    const alert = await Alert.findOneAndDelete({
      _id: id,
      userId
    });

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }

    res.json({
      success: true,
      message: 'Alert deleted successfully'
    });
  } catch (error) {
    console.error('Delete alert error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting alert'
    });
  }
};

// Delete all read alerts for user
const deleteReadAlerts = async (req, res) => {
  try {
    const userId = req.userId;

    // Delete all read alerts for the user
    const result = await Alert.deleteMany({
      userId,
      isRead: true
    });

    res.json({
      success: true,
      message: `Deleted ${result.deletedCount} read alert(s)`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Delete read alerts error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting read alerts'
    });
  }
};

module.exports = {
  getAlerts,
  markAsRead,
  deleteAlert,
  deleteReadAlerts
};

