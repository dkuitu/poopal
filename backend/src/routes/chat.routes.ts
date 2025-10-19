import { Router } from 'express';
import { z } from 'zod';
import * as chatController from '../controllers/chat.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

const chatSchema = z.object({
  body: z.object({
    message: z.string().min(1, 'Message is required').max(1000, 'Message too long'),
  }),
});

// POST /api/chat - Send message to Dr. Poo
router.post('/', validate(chatSchema), chatController.chat);

// GET /api/chat/proactive - Get proactive insight if any
router.get('/proactive', chatController.getProactiveInsight);

export default router;
