import { Request, Response, NextFunction } from 'express';
import * as aiService from '../services/ai.service';

export const analyzeStoolImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { imageBase64, customPrompt } = req.body;

    const result = await aiService.analyzeStoolImage(imageBase64, customPrompt);

    res.json({
      status: 'success',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
