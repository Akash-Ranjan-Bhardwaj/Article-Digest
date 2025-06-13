
const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({

    articleId : {
        type: String,
        required: true,
    },
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
    thumbmail : {
        type: String,  
        required: true,
        default: "default-thumbnail.jpg"
    },
    userId :{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    isPublished : {
        type : Boolean,
        default: true
    },
    summary: {
        type: String,

    },
    likesCount: {
        type: Number,
        required: true,
        min: 0
    },
    dislikesCount: {
        type: Number,
        required: true,
        min: 0
    },
    commetsCount: {
        type: Number,
        required: true,
        min: 0
    },
    readCount: {
        type: Number,
        required: true,
        min: 0
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


},{timestamps :true});