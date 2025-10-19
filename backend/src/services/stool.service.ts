import pool from '../config/pg-client';
import { AppError } from '../middleware/error-handler.middleware';

export interface CreateStoolInput {
  bristolType: number; // 1-7
  color?: string; // HEX color code
  consistency?: string;
  size?: string;
  urgency?: number; // 1-10
  completeness?: number; // 1-10
  bloodPresent?: boolean;
  mucusPresent?: boolean;
  undigestedFood?: boolean;
  photoUrl?: string;
  notes?: string;
  loggedAt: string; // ISO datetime string
}

export const createStoolLog = async (userId: string, input: CreateStoolInput) => {
  try {
    const result = await pool.query(
      `INSERT INTO stool_logs
       (id, user_id, bristol_type, color, consistency, size, urgency, completeness,
        blood_present, mucus_present, undigested_food, notes, logged_at, created_at, updated_at)
       VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW())
       RETURNING id, user_id, bristol_type, color, consistency, size, urgency, completeness,
                 blood_present, mucus_present, undigested_food, notes, logged_at, created_at`,
      [
        userId,
        input.bristolType,
        input.color || null,
        input.consistency || null,
        input.size || null,
        input.urgency || null,
        input.completeness || null,
        input.bloodPresent || false,
        input.mucusPresent || false,
        input.undigestedFood || false,
        input.notes || null,
        input.loggedAt,
      ]
    );

    return result.rows[0];
  } catch (error) {
    console.error('Error creating stool log:', error);
    throw new AppError(500, 'Failed to create stool log');
  }
};

export const getUserStoolLogs = async (userId: string, limit: number = 50) => {
  try {
    const result = await pool.query(
      `SELECT id, bristol_type, color, consistency, size, urgency, completeness,
              blood_present, mucus_present, undigested_food, notes, logged_at, created_at
       FROM stool_logs
       WHERE user_id = $1
       ORDER BY logged_at DESC
       LIMIT $2`,
      [userId, limit]
    );

    return result.rows;
  } catch (error) {
    console.error('Error getting stool logs:', error);
    throw new AppError(500, 'Failed to get stool logs');
  }
};

export const deleteStoolLog = async (userId: string, logId: string) => {
  try {
    const result = await pool.query(
      `DELETE FROM stool_logs
       WHERE id = $1 AND user_id = $2
       RETURNING id`,
      [logId, userId]
    );

    if (result.rows.length === 0) {
      throw new AppError(404, 'Stool log not found');
    }

    return { id: result.rows[0].id };
  } catch (error) {
    if (error instanceof AppError) throw error;
    console.error('Error deleting stool log:', error);
    throw new AppError(500, 'Failed to delete stool log');
  }
};
