
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  articleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: [true, 'Comment content is required'],
    minlength: [3, 'Comment should be at least 3 characters long']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Comment', commentSchema);
