import { Router } from 'express';
import * as postsController from '../controllers/posts';
import { auth } from '../middlewares/auth';

const router = Router();

// Get posts with cursor pagination
router.get('/', postsController.getPosts);

// Get posts by user
router.get('/user/:id', postsController.getUserPosts);

// Get single post with metadata and replies
router.get('/:id', postsController.getPostById);

// Create a new post
router.post('/', auth, postsController.createPost);

// Toggle like on a post
router.post('/:id/like', auth, postsController.toggleLike);

// Reply to a post
router.post('/:id/reply', auth, postsController.replyToPost);

// Delete a post
router.delete('/:id', auth, postsController.deletePost);

export default router; 