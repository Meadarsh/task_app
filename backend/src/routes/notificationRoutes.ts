import express from 'express';
import { protect } from '../middleware/authMiddleware';
import { getNotifications, markNotificationAsRead } from '../controller/notification.controller';

const router = express.Router();

router.use(protect);

router.get('/', getNotifications);
router.patch('/:id/read', markNotificationAsRead);

export default router;