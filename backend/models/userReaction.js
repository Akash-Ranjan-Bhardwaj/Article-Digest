const mongoose = require('mongoose');

const reactionSchema = new mongoose.Schema({
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
  type: { 
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('userReaction', reactionSchema);