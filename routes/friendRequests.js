import express from 'express';
import { sendRequest, acceptRequest, declineRequest, getFriendRequests } from '../controllers/friendRequest.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', verifyToken, sendRequest);
router.patch('/:id/accept', verifyToken, acceptRequest);
router.patch('/:id/decline', verifyToken, declineRequest);
router.get('/:userId', verifyToken, getFriendRequests);

export default router;
