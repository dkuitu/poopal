import pool from '../config/pg-client';
import { AppError } from '../middleware/error-handler.middleware';

interface DashboardSummary {
  gutHealthScore: number;
  streakDays: number;
  triggersFound: number;
  achievementsUnlocked: number;
  totalAchievements: number;
  totalLogs: number;
  lastLogDate: Date | null;
}

interface TrendData {
  date: string;
  bristolType: number | null;
  logsCount: number;
  avgBristolType: number | null;
}

interface CalendarDay {
  date: string;
  bristolType: number | null;
  logsCount: number;
  hasSymptoms: boolean;
  color: string | null;
}

export const getDashboardSummary = async (userId: string): Promise<DashboardSummary> => {
  try {
    // Get total logs
    const logsResult = await pool.query(
      'SELECT COUNT(*) as count, MAX(logged_at) as last_log FROM stool_logs WHERE user_id = $1',
      [userId]
    );
    const totalLogs = parseInt(logsResult.rows[0].count);
    const lastLogDate = logsResult.rows[0].last_log;

    // Calculate streak
    const streakResult = await pool.query(
      `WITH daily_logs AS (
        SELECT DATE(logged_at) as log_date
        FROM stool_logs
        WHERE user_id = $1
        GROUP BY DATE(logged_at)
        ORDER BY DATE(logged_at) DESC
      ),
      streak_calc AS (
        SELECT
          log_date,
          log_date - (ROW_NUMBER() OVER (ORDER BY log_date DESC))::integer as streak_group
        FROM daily_logs
      )
      SELECT COUNT(*) as streak
      FROM streak_calc
      WHERE streak_group = (SELECT streak_group FROM streak_calc LIMIT 1)`,
      [userId]
    );
    const streakDays = parseInt(streakResult.rows[0]?.streak || '0');

    // Get triggers count
    const triggersResult = await pool.query(
      'SELECT COUNT(*) as count FROM triggers WHERE user_id = $1 AND confidence_score > 70',
      [userId]
    );
    const triggersFound = parseInt(triggersResult.rows[0].count);

    // Get achievements
    const achievementsResult = await pool.query(
      `SELECT
        (SELECT COUNT(*) FROM user_achievements WHERE user_id = $1) as unlocked,
        (SELECT COUNT(*) FROM achievements) as total`,
      [userId]
    );
    const achievementsUnlocked = parseInt(achievementsResult.rows[0]?.unlocked || '0');
    const totalAchievements = parseInt(achievementsResult.rows[0]?.total || '50');

    // Calculate gut health score (weighted formula)
    // Based on: ideal bristol types (30%), consistency (20%), streak (20%),
    // low symptoms (15%), trigger avoidance (15%)
    const recentLogsResult = await pool.query(
      `SELECT bristol_type, logged_at
       FROM stool_logs
       WHERE user_id = $1 AND logged_at >= NOW() - INTERVAL '30 days'
       ORDER BY logged_at DESC`,
      [userId]
    );

    let bristolScore = 50; // Base score
    if (recentLogsResult.rows.length > 0) {
      const idealCount = recentLogsResult.rows.filter(
        (r) => r.bristol_type === 3 || r.bristol_type === 4
      ).length;
      bristolScore = Math.min(100, (idealCount / recentLogsResult.rows.length) * 100);
    }

    const streakScore = Math.min(100, streakDays * 5); // Max at 20 days
    const consistencyScore = totalLogs > 0 ? Math.min(100, totalLogs * 2) : 0;

    const gutHealthScore = Math.round(
      bristolScore * 0.4 + streakScore * 0.3 + consistencyScore * 0.3
    );

    return {
      gutHealthScore,
      streakDays,
      triggersFound,
      achievementsUnlocked,
      totalAchievements,
      totalLogs,
      lastLogDate,
    };
  } catch (error) {
    console.error('Error getting dashboard summary:', error);
    throw new AppError(500, 'Failed to get dashboard summary');
  }
};

export const getTrends = async (userId: string, days: number = 30): Promise<TrendData[]> => {
  try {
    const result = await pool.query(
      `SELECT
        DATE(logged_at) as date,
        AVG(bristol_type) as avg_bristol_type,
        COUNT(*) as logs_count
       FROM stool_logs
       WHERE user_id = $1
         AND logged_at >= NOW() - INTERVAL '1 day' * $2
       GROUP BY DATE(logged_at)
       ORDER BY date ASC`,
      [userId, days]
    );

    return result.rows.map((row) => ({
      date: row.date.toISOString().split('T')[0],
      bristolType: row.avg_bristol_type ? Math.round(row.avg_bristol_type) : null,
      logsCount: parseInt(row.logs_count),
      avgBristolType: row.avg_bristol_type ? parseFloat(row.avg_bristol_type) : null,
    }));
  } catch (error) {
    console.error('Error getting trends:', error);
    throw new AppError(500, 'Failed to get trends data');
  }
};

export const getCalendarData = async (
  userId: string,
  year: number,
  month: number
): Promise<CalendarDay[]> => {
  try {
    const result = await pool.query(
      `SELECT
        DATE(sl.logged_at) as date,
        AVG(sl.bristol_type) as avg_bristol_type,
        COUNT(DISTINCT sl.id) as logs_count,
        BOOL_OR(sym.id IS NOT NULL) as has_symptoms,
        MODE() WITHIN GROUP (ORDER BY sl.color) as color
       FROM stool_logs sl
       LEFT JOIN symptom_logs sym ON DATE(sym.logged_at) = DATE(sl.logged_at)
         AND sym.user_id = sl.user_id
       WHERE sl.user_id = $1
         AND EXTRACT(YEAR FROM sl.logged_at) = $2
         AND EXTRACT(MONTH FROM sl.logged_at) = $3
       GROUP BY DATE(sl.logged_at)
       ORDER BY date ASC`,
      [userId, year, month]
    );

    return result.rows.map((row) => ({
      date: row.date.toISOString().split('T')[0],
      bristolType: row.avg_bristol_type ? Math.round(row.avg_bristol_type) : null,
      logsCount: parseInt(row.logs_count),
      hasSymptoms: row.has_symptoms || false,
      color: row.color,
    }));
  } catch (error) {
    console.error('Error getting calendar data:', error);
    throw new AppError(500, 'Failed to get calendar data');
  }
};

export const getRecentTriggers = async (userId: string, limit: number = 10) => {
  try {
    const result = await pool.query(
      `SELECT
        t.id,
        t.trigger_type,
        t.confidence_score,
        t.occurrences,
        t.last_detected_at,
        t.user_confirmed,
        f.name as food_name,
        f.category as food_category
       FROM triggers t
       JOIN foods f ON t.food_id = f.id
       WHERE t.user_id = $1
       ORDER BY t.confidence_score DESC, t.last_detected_at DESC
       LIMIT $2`,
      [userId, limit]
    );

    return result.rows;
  } catch (error) {
    console.error('Error getting triggers:', error);
    throw new AppError(500, 'Failed to get triggers');
  }
};

export const getWeeklyComparison = async (userId: string) => {
  try {
    const result = await pool.query(
      `WITH this_week AS (
        SELECT
          AVG(bristol_type) as avg_bristol,
          COUNT(*) as log_count
        FROM stool_logs
        WHERE user_id = $1
          AND logged_at >= DATE_TRUNC('week', NOW())
      ),
      last_week AS (
        SELECT
          AVG(bristol_type) as avg_bristol,
          COUNT(*) as log_count
        FROM stool_logs
        WHERE user_id = $1
          AND logged_at >= DATE_TRUNC('week', NOW()) - INTERVAL '7 days'
          AND logged_at < DATE_TRUNC('week', NOW())
      ),
      this_week_symptoms AS (
        SELECT COUNT(*) as symptom_count
        FROM symptom_logs
        WHERE user_id = $1
          AND logged_at >= DATE_TRUNC('week', NOW())
      ),
      last_week_symptoms AS (
        SELECT COUNT(*) as symptom_count
        FROM symptom_logs
        WHERE user_id = $1
          AND logged_at >= DATE_TRUNC('week', NOW()) - INTERVAL '7 days'
          AND logged_at < DATE_TRUNC('week', NOW())
      )
      SELECT
        tw.avg_bristol as this_week_bristol,
        tw.log_count as this_week_logs,
        lw.avg_bristol as last_week_bristol,
        lw.log_count as last_week_logs,
        tws.symptom_count as this_week_symptoms,
        lws.symptom_count as last_week_symptoms
      FROM this_week tw, last_week lw, this_week_symptoms tws, last_week_symptoms lws`,
      [userId]
    );

    return result.rows[0] || {
      this_week_bristol: null,
      this_week_logs: 0,
      last_week_bristol: null,
      last_week_logs: 0,
      this_week_symptoms: 0,
      last_week_symptoms: 0,
    };
  } catch (error) {
    console.error('Error getting weekly comparison:', error);
    throw new AppError(500, 'Failed to get weekly comparison');
  }
};
