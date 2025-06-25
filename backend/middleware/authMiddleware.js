
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  try {
    
    const token = req.headers.authorization?.split(' ')[1]; 

    if (!token) {
      return res.status(401).json({ error: "Not authorized, no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: "User no longer exists" });
    }

    req.user = user;
    next();

  } catch (err) {
    res.status(401).json({ error: "Not authorized, invalid token" });
  }
};

const Article = require('../models/Article');

exports.checkArticleOwnership = async (req, res, next) => {
  try {
    
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }

    if (article.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized to modify this article" });
    }

    req.article = article;
    next(); 

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};