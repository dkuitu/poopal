import { Router } from 'express';
import { z } from 'zod';
import * as mealController from '../controllers/meal.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

const createMealSchema = z.object({
  body: z.object({
    mealType: z.enum(['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK']),
    description: z.string().min(1, 'Description is required'),
    ingredients: z.array(z.string()).optional().nullable(),
    estimatedFiberG: z.number().optional().nullable(),
    estimatedWaterMl: z.number().optional().nullable(),
    loggedAt: z.string().datetime(),
  }),
});

// POST /api/meals - Create meal log
router.post('/', validate(createMealSchema), mealController.createMeal);

// GET /api/meals - Get user's meals
router.get('/', mealController.getUserMeals);

// DELETE /api/meals/:id - Delete a meal log
router.delete('/:id', mealController.deleteMeal);

export default router;
