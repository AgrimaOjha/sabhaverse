const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller');
const authMiddleware = require('../middleware/auth.middleware');


router.get('/', postController.getAllPosts);
router.get('/:id', postController.getPostById);


router.post('/', authMiddleware, postController.createPost);
router.put('/:id', authMiddleware, postController.updatePost);
router.delete('/:id', authMiddleware, postController.deletePost);
router.post('/:id/upvote', authMiddleware, postController.upvotePost);

module.exports = router;