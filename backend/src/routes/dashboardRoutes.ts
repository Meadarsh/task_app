import express from 'express';
import { protect } from '../middleware/authMiddleware';
import { dashboardChart } from '../controller/dashboard.controller';

const router = express.Router();

router.use(protect);

router.get('/',dashboardChart);

export default router;