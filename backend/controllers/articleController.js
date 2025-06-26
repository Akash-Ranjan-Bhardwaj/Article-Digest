const Article = require('../models/Article');
const shortid = require('shortid');
const Reaction = require('../models/Reaction');
const User = require('../models/User');

exports.createArticle = async (req, res) => {
  const { title, content, summary, tags } = req.body;
  const thumbnail = req.file ? req.file.filename : 'default-thumbnail.jpg';

  try {
    const slugBase = title
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 100);

    const slug = `${slugBase}-${shortid.generate()}`;

    const article = await Article.create({
      title,
      content,
      summary,
      tags,
      slug,
      thumbnail,
      userId: req.user._id
    });

    res.status(201).json({ message: 'Article created successfully', article });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create article' });
  }
};

exports.updateArticle = async (req, res) => {
  const { slug } = req.params;
  const { title, content, summary, tags, archived } = req.body;

  try {
    const article = await Article.findOne({ slug, userId: req.user._id });
    if (!article) return res.status(404).json({ error: 'Article not found or unauthorized' });

    if (title) article.title = title;
    if (content) article.content = content;
    if (summary) article.summary = summary;
    if (tags) article.tags = tags;
    if (archived !== undefined) article.archived = archived;
    if (req.file) article.thumbnail = req.file.filename;

    await article.save();

    res.status(200).json({ message: 'Article updated successfully', article });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update article' });
  }
};

exports.deleteArticle = async (req, res) => {
  const { slug } = req.params;

  try {
    const article = await Article.findOneAndDelete({ slug, userId: req.user._id });

    if (!article) return res.status(404).json({ error: 'Article not found or unauthorized' });

    res.status(200).json({ message: 'Article deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete article' });
  }
};


exports.toggleReaction = async (req, res) => {
  const { slug } = req.params;
  const { type } = req.body;

  if (!['like', 'dislike'].includes(type)) {
    return res.status(400).json({ error: 'Invalid reaction type' });
  }

  try {
    const article = await Article.findOne({ slug });
    if (!article) return res.status(404).json({ error: 'Article not found' });

    const existing = await Reaction.findOne({
      articleId: article._id,
      userId: req.user._id
    });

    if (existing && existing.type === type) {
      await existing.deleteOne();
      return res.status(200).json({ message: `${type} removed` });
    }

    if (existing) {
      existing.type = type;
      await existing.save();
      return res.status(200).json({ message: `Changed to ${type}` });
    }

    await Reaction.create({
      articleId: article._id,
      userId: req.user._id,
      type
    });

    res.status(201).json({ message: `${type} added` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to toggle reaction' });
  }
};



exports.toggleBookmark = async (req, res) => {
  const { slug } = req.params;

  try {
    const article = await Article.findOne({ slug });
    if (!article) return res.status(404).json({ error: 'Article not found' });

    const user = await User.findById(req.user._id);
    const index = user.bookmarks.indexOf(article._id);

    if (index === -1) {
      user.bookmarks.push(article._id);
      await user.save();
      return res.status(200).json({ message: 'Article bookmarked' });
    }

    user.bookmarks.splice(index, 1);
    await user.save();
    res.status(200).json({ message: 'Bookmark removed' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to toggle bookmark' });
  }
};


exports.getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find({ archived: false }).sort({ createdAt: -1 });
    res.status(200).json({ message: "Articles fetched successfully", articles });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.searchArticles = async (req, res) => {
  const { query } = req.query;

  try {
    const articles = await Article.find({
      archived: false,
      title: new RegExp(query, 'i') 
    });

    res.status(200).json({ message: "Search successful", articles });
  } catch (err) {
    res.status(500).json({ error: "Search failed" });
  }
};

exports.getArticleBySlug = async (req, res) => {
  const { slug } = req.params;

  try {
    const article = await Article.findOne({ slug, archived: false });

    if (!article) return res.status(404).json({ error: "Article not found" });

    res.status(200).json({ message: "Article fetched successfully", article });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};


exports.generateSummary = async (req, res) => {
  const { slug } = req.params;

  try {
    const article = await Article.findOne({ slug });
    if (!article) return res.status(404).json({ error: 'Article not found' });

   
    article.summary = "this is a sample summary , being used to test the controller "

    await article.save();
    res.status(200).json({ message: 'Summary generated', summary: article.summary });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate summary' });
  }
};
