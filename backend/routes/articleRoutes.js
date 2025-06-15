// Importing required modules
const express = require ('express');
const {getAllArticles, 
       searchArticles,
       getArticleBySlug, 
       getArticleComments, 
       createArticle, 
       updateArticle, 
       toggleLike, 
       toggleBookmark, 
       deleteArticle, 
       generateSummary} = require('../controllers/articleController.js');
const {checkArticleOwnership, protect} = require('../middleware/authMiddleware.js');
const { uploadArtilceImage } = require('../middleware/uploadMiddleware.js');


// Initializing Article Router
const Articlerouter = express.Router();

Articlerouter.get('/', getAllArticles);
Articlerouter.get('/search', searchArticles);
Articlerouter.get('/:slug', getArticleBySlug);
Articlerouter.get('/:slug/comments', getArticleComments);

Articlerouter.use(protect);

Articlerouter.post('/', uploadArtilceImage.single('thumbnail'), createArticle);
Articlerouter.patch('/:slug', checkArticleOwnership, uploadArtilceImage.single('thumbnail'), updateArticle);
Articlerouter.delete('/:slug', checkArticleOwnership, deleteArticle);

Articlerouter.post('/:slug/like', toggleLike);
Articlerouter.post('/:slug/bookmark', toggleBookmark);
Articlerouter.post('/:slug/generate-summary', generateSummary);

module.exports = Articlerouter;