import { Request, Response, NextFunction } from 'express';
import * as statsService from '../services/stats.service';

export const getDashboardSummary = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.userId;
    const summary = await statsService.getDashboardSummary(userId);

    res.json({
      status: 'success',
      data: summary,
    });
  } catch (error) {
    next(error);
  }
};

export const getTrends = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const days = parseInt(req.query.days as string) || 30;

    const trends = await statsService.getTrends(userId, days);

    res.json({
      status: 'success',
      data: trends,
    });
  } catch (error) {
    next(error);
  }
};

export const getCalendarData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const year = parseInt(req.query.year as string) || new Date().getFullYear();
    const month = parseInt(req.query.month as string) || new Date().getMonth() + 1;

    const calendar = await statsService.getCalendarData(userId, year, month);

    res.json({
      status: 'success',
      data: calendar,
    });
  } catch (error) {
    next(error);
  }
};

export const getRecentTriggers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.userId;
    const limit = parseInt(req.query.limit as string) || 10;

    const triggers = await statsService.getRecentTriggers(userId, limit);

    res.json({
      status: 'success',
      data: triggers,
    });
  } catch (error) {
    next(error);
  }
};

export const getWeeklyComparison = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.userId;
    const comparison = await statsService.getWeeklyComparison(userId);

    res.json({
      status: 'success',
      data: comparison,
    });
  } catch (error) {
    next(error);
  }
};
