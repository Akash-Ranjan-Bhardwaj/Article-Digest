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



const router = express.Router();

router.get('/', getAllArticles);
router.get('/search', searchArticles);
router.get('/:slug', getArticleBySlug);
router.get('/:slug/comments', getArticleComments);

router.use(protect);

router.post('/', uploadArtilceImage.single('thumbnail'), createArticle);
router.patch('/:slug', checkArticleOwnership, uploadArtilceImage.single('thumbnail'), updateArticle);
router.delete('/:slug', checkArticleOwnership, deleteArticle);

router.post('/:slug/like', toggleLike);
router.post('/:slug/bookmark', toggleBookmark);
router.post('/:slug/generate-summary', generateSummary);

module.exports = router;



