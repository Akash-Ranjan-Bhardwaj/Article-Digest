
const express = requrie('express');
const {getMyProfile, deleteAccount, updateProfile, getMyBookmarks, getMyArticles, getPublicProfile} = require('../controllers/userController.js');
const {protect} = require('../middleware/authMiddleware.js');

const router = express.Router();

router.get('/:username', getPublicProfile);

router.use(protect);

router.get('/me', getMyProfile);
router.delete('/me', deleteAccount);
router.patch('/me', updateProfile);
router.get('/me/bookmarks', getMyBookmarks);
router.get('/me/articles', getMyArticles);

module.exports = router;