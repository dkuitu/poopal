import { Router } from 'express';
import { z } from 'zod';
import * as aiController from '../controllers/ai.controller';
import { validate } from '../middleware/validation.middleware';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

const analyzeImageSchema = z.object({
  body: z.object({
    imageBase64: z.string().min(1, 'Image data is required'),
    customPrompt: z.string().optional(),
  }),
});

// Test endpoint - requires authentication
router.post(
  '/analyze-stool-image',
  authenticate,
  validate(analyzeImageSchema),
  aiController.analyzeStoolImage
);

export default router;
