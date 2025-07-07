const express = require ('express');
const {getAllArticles, 
       searchArticles,
       getArticleBySlug,
       createArticle, 
       updateArticle, 
       toggleReaction, 
       toggleBookmark, 
       deleteArticle, 
       generateSummary} = require('../controllers/articleController.js');
const {checkArticleOwnership, protect} = require('../middleware/authMiddleware.js');
const { uploadArtilceImage } = require('../middleware/uploadMiddleware.js');



const router = express.Router();

router.get('/', getAllArticles);
router.get('/search', searchArticles);
router.get('/:slug', getArticleBySlug);

router.use(protect);

router.post('/', uploadArtilceImage.single('thumbnail'), createArticle);
router.patch('/:slug', checkArticleOwnership, uploadArtilceImage.single('thumbnail'), updateArticle);
router.delete('/:slug', checkArticleOwnership, deleteArticle);

router.post('/:slug/like', toggleReaction);
router.post('/:slug/bookmark', toggleBookmark);
router.post('/:slug/generate-summary', generateSummary);

module.exports = router;



