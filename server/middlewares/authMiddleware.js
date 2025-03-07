const User = require('../models/User');

exports.getUserFromRequest = async (req, res, next) => {
  try {
    const username = req.query.user || req.headers['x-user'];
    
    if (!username) {
      return res.status(401).json({ 
        success: false, 
        message: 'User identification required. Use ?user=username or x-user header' 
      });
    }
    
    const user = await User.findOne({ username });
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: `User ${username} not found` 
      });
    }
    
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error while authenticating user', 
      error: error.message 
    });
  }
};