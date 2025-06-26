const express = require('express');
const {
  addComment,
  getComments,
  deleteComment,
  editComment
} = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/:slug/comments', getComments);
router.post('/:slug/comments', protect, addComment);
router.delete('/comment/:commentId', protect, deleteComment);
router.patch('/comment/:commentId', protect, editComment);  

module.exports = router;
