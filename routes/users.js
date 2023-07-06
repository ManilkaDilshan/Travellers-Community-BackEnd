import express from 'express';
import { getUser, getUserFriends, removeFriends, getAllUsers } from '../controllers/users.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/:id', verifyToken, getUser);
router.get('/:id/friends', verifyToken, getUserFriends);
router.get('/:userId/allUsers', verifyToken, getAllUsers);

router.patch('/:id/:friendId', verifyToken, removeFriends);

export default router;
