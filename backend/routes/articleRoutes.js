// Importing required modules
const express = require('express');
const { getAllArticles, getArticle, createArticle, updateArticle, deleteArticle } = require('../controllers/articleController.js');

// Initializing the router
const articleRouter = express.Router();

// Initializing the Routes
articleRouter.get("/getAllArticles", getAllArticles)
articleRouter.get("/getArticle", getArticle)
articleRouter.post('/createArticle', createArticle)
articleRouter.put('/updateArticle', updateArticle)
articleRouter.delete('/deleteArticle', deleteArticle)