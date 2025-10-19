import { Router } from 'express';
import * as statsController from '../controllers/stats.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET /api/stats/summary - Get dashboard summary
router.get('/summary', statsController.getDashboardSummary);

// GET /api/stats/trends?days=30 - Get trends data
router.get('/trends', statsController.getTrends);

// GET /api/stats/calendar?year=2025&month=1 - Get calendar data
router.get('/calendar', statsController.getCalendarData);

// GET /api/stats/triggers?limit=10 - Get recent triggers
router.get('/triggers', statsController.getRecentTriggers);

// GET /api/stats/weekly-comparison - Get weekly comparison
router.get('/weekly-comparison', statsController.getWeeklyComparison);

export default router;
