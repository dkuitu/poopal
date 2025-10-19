import pool from '../config/pg-client';
import { AppError } from '../middleware/error-handler.middleware';

export interface CreateMealInput {
  mealType: 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK';
  description: string;
  ingredients?: string[];
  estimatedFiberG?: number;
  estimatedWaterMl?: number;
  loggedAt: string; // ISO datetime string
}

export const createMeal = async (userId: string, input: CreateMealInput) => {
  try {
    const result = await pool.query(
      `INSERT INTO meal_logs
       (id, user_id, meal_type, description, photo_url, ingredients, estimated_fiber_g, estimated_water_ml, logged_at, created_at, updated_at)
       VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
       RETURNING id, user_id, meal_type, description, photo_url, ingredients, estimated_fiber_g, estimated_water_ml, logged_at, created_at`,
      [
        userId,
        input.mealType,
        input.description,
        null, // photo_url
        input.ingredients ? JSON.stringify(input.ingredients) : null,
        input.estimatedFiberG || null,
        input.estimatedWaterMl || null,
        input.loggedAt,
      ]
    );

    return result.rows[0];
  } catch (error) {
    console.error('Error creating meal log:', error);
    throw new AppError(500, 'Failed to create meal log');
  }
};

export const getUserMeals = async (userId: string, limit: number = 50) => {
  try {
    const result = await pool.query(
      `SELECT id, user_id, meal_type, description, photo_url, ingredients,
              estimated_fiber_g, estimated_water_ml, logged_at, created_at
       FROM meal_logs
       WHERE user_id = $1
       ORDER BY logged_at DESC
       LIMIT $2`,
      [userId, limit]
    );

    return result.rows;
  } catch (error) {
    console.error('Error getting user meals:', error);
    throw new AppError(500, 'Failed to get meals');
  }
};

export const deleteMeal = async (userId: string, mealId: string) => {
  try {
    const result = await pool.query(
      'DELETE FROM meal_logs WHERE id = $1 AND user_id = $2 RETURNING id',
      [mealId, userId]
    );

    if (result.rows.length === 0) {
      throw new AppError(404, 'Meal log not found');
    }

    return { success: true };
  } catch (error) {
    if (error instanceof AppError) throw error;
    console.error('Error deleting meal log:', error);
    throw new AppError(500, 'Failed to delete meal log');
  }
};
