
const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({

   
    title : {
        type: String, 
        required: true,
        unique: true
    },
    content : {
        type: String,
        required: [true, 'Content is required'],
        minlength: [100, 'Content should be at least 100 characters']

    },
    thumbnail : {
        type: String,  
        default: "default-thumbnail.jpg"
    },
    userId :{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    archived: {
        type : Boolean,
        default: false
    },
    summary: {
        type: String,

    },
    slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
    },
    tags: [{
    type: String,
    lowercase: true
    }]


},{timestamps :true,
    
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

articleSchema.virtual('dislikesCount', {
  ref: 'Reaction',
  localField: '_id',
  foreignField: 'articleId',
  match: { type: 'dislike' },
  count: true
});

articleSchema.virtual('viewsCount', {
  ref: 'View',
  localField: '_id',
  foreignField: 'articleId',
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

module.exports = mongoose.model("Article", articleSchema);