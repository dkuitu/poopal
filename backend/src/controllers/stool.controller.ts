import { Request, Response, NextFunction } from 'express';
import * as stoolService from '../services/stool.service';

export const createStoolLog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const log = await stoolService.createStoolLog(userId, req.body);

    res.status(201).json({
      status: 'success',
      data: log,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserStoolLogs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const limit = parseInt(req.query.limit as string) || 50;

    const logs = await stoolService.getUserStoolLogs(userId, limit);

    res.json({
      status: 'success',
      data: logs,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteStoolLog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;

    const result = await stoolService.deleteStoolLog(userId, id);

    res.json({
      status: 'success',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
