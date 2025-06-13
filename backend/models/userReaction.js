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
}, { timestamps: true ,

    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

articleSchema.virtual('commentsCount', {
  ref: 'Comment', 
  localField: '_id',
  foreignField: 'articleId',
  count: true
});

articleSchema.virtual('likesCount', {
  ref: 'Reaction',
  localField: '_id',
  foreignField: 'articleId',
  match: { type: 'like' },  
  count: true
});

articleSchema.pre('save', function(next) {
  if (!this.isModified('title')) return next();
  
  this.slug = this.title
    .toLowerCase()
    .replace(/[^\w\s]/g, '')  
    .replace(/\s+/g, '-')     
    .substring(0, 100);      
    
  next();
});


module.exports = mongoose.model('userReaction', reactionSchema);