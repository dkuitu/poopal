import { Router } from 'express';
import authRoutes from './auth.routes';
import aiRoutes from './ai.routes';
import statsRoutes from './stats.routes';
import chatRoutes from './chat.routes';
import mealRoutes from './meal.routes';
import stoolRoutes from './stool.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/ai', aiRoutes);
router.use('/stats', statsRoutes);
router.use('/chat', chatRoutes);
router.use('/meals', mealRoutes);
router.use('/stools', stoolRoutes);

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

export default router;
