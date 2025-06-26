const Comment = require('../models/Comment');
const Article = require('../models/Article');

exports.addComment = async (req, res) => {
  const { slug } = req.params;
  const { content } = req.body;

  try {
    const article = await Article.findOne({ slug });
    if (!article) return res.status(404).json({ error: 'Article not found' });

    const comment = await Comment.create({
      articleId: article._id,
      userId: req.user._id,
      content
    });

    res.status(201).json({ message: 'Comment added', comment });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};


exports.getComments = async (req, res) => {
  const { slug } = req.params;

  try {
    const article = await Article.findOne({ slug });
    if (!article) return res.status(404).json({ error: 'Article not found' });

    const comments = await Comment.find({ articleId: article._id })
      .populate('userId', 'username')
      .sort({ createdAt: -1 });

    res.status(200).json({ comments });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.editComment = async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    if (comment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'You can only edit your own comments' });
    }

    comment.content = content || comment.content;
    await comment.save();

    res.status(200).json({ message: 'Comment updated successfully', comment });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};


exports.deleteComment = async (req, res) => {
  const { commentId } = req.params;

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    const isOwner = comment.userId.toString() === req.user._id.toString();

    if (!isOwner) return res.status(403).json({ error: 'Not authorized to delete this comment' });

    await Comment.findByIdAndDelete(commentId);
    res.status(200).json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
