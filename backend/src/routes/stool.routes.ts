import { Router } from 'express';
import { z } from 'zod';
import * as stoolController from '../controllers/stool.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

const createStoolSchema = z.object({
  body: z.object({
    bristolType: z.number().int().min(1).max(7),
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(), // HEX color code
    consistency: z.enum(['HARD', 'FIRM', 'SOFT', 'LIQUID', 'WATERY']).optional(),
    size: z.enum(['SMALL', 'MEDIUM', 'LARGE']).optional(),
    urgency: z.number().int().min(1).max(10).optional(),
    completeness: z.number().int().min(1).max(10).optional(),
    bloodPresent: z.boolean().optional(),
    mucusPresent: z.boolean().optional(),
    undigestedFood: z.boolean().optional(),
    photoUrl: z.string().optional(), // Can be base64 or URL
    notes: z.string().max(500).optional(),
    loggedAt: z.string().datetime(),
  }),
});

// POST /api/stools - Create stool log
router.post('/', validate(createStoolSchema), stoolController.createStoolLog);

// GET /api/stools - Get user's stool logs
router.get('/', stoolController.getUserStoolLogs);

// DELETE /api/stools/:id - Delete a stool log
router.delete('/:id', stoolController.deleteStoolLog);

export default router;
