import { Request, Response, NextFunction } from 'express';
import * as chatService from '../services/chat.service';

export const chat = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { message } = req.body;

    const response = await chatService.chat(userId, message);

    res.json({
      status: 'success',
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

export const getProactiveInsight = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;

    const insight = await chatService.getProactiveInsight(userId);

    res.json({
      status: 'success',
      data: insight,
    });
  } catch (error) {
    next(error);
  }
};
