const Article = require('../models/Article');
const User = require('../models/User');

// GET PUBLIC PROFILE
exports.getPublicProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('username createdAt') // Public-safe fields only
      .populate({
        path: 'bookmarks',
        select: 'title summary', // Only public article fields
        options: { limit: 5 }
      })
      .lean();

    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('username email role bookmarks createdAt') 
      .populate({
        path: 'bookmarks',
        select: 'title summary createdAt',
        options: { limit: 5 }
      });

    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};


exports.updateProfile = async (req, res) => {
  const { username, email } = req.body;
  
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: 'User not found' });

  
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) return res.status(400).json({ error: 'Email already in use' });
    }

    user.username = username || user.username;
    user.email = email || user.email;
    await user.save();

    const safeUser = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    };
    
    res.status(200).json({message : "profile updated successfully", safeUser});
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user._id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.status(200).json({ message: 'Account deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getMyBookmarks = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const user = await User.findById(req.user._id).populate({
        path: 'bookmarks',
        select: 'title summary createdAt',
        options: {
          limit: limit,
          sort: { createdAt: -1 }
        }
      });

    if (!user) return res.status(404).json({ error: 'User not found' });
    
    const totalBookmarks = (await User.findById(req.user._id)).bookmarks.length;
    
    res.status(200).json({message : "user bookmarks fetched successfully", bookmarks: user.bookmarks});
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};


exports.getMyArticles = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const articles = await Article.find({ author: req.user._id })
      .select('title summary createdAt thumbnail') 
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const total = await Article.countDocuments({ author: req.user._id });
    
    res.status(200).json({message : "articles fetched successfully", articles});
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};